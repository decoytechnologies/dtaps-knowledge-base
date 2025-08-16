import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

// S3 Client and Multer Config
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());

// --- ASSET UPLOAD ENDPOINT ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const fileName = `${Date.now()}_${req.file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  });
  try {
    await s3Client.send(command);
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// --- PUBLIC ENDPOINTS ---
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
          include: {
            articles: { where: { published: true }, select: { title: true, slug: true } },
          }
        },
        articles: { where: { published: true }, select: { title: true, slug: true } },
      },
    });
    res.json({ data: modules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { module: true }
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.get('/api/article-slugs', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slugs' });
  }
});

// --- ADMIN ENDPOINTS ---
app.get('/api/admin/modules', async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: { children: { orderBy: { order: 'asc' } } }
    });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin modules' });
  }
});

app.post('/api/modules', async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Module name is required.' });
    }
    const newModule = await prisma.module.create({ 
      data: { 
        name, 
        description,
        parentId: parentId ? parseInt(parentId, 10) : null,
      } 
    });
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create module.' });
  }
});

app.post('/api/modules/reorder', async (req, res) => {
  const { orderedModules } = req.body;
  try {
    const updatePromises = orderedModules.map((mod: any) => 
      prisma.module.update({
        where: { id: mod.id },
        data: { order: mod.order, parentId: mod.parentId },
      })
    );
    await prisma.$transaction(updatePromises);
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update module order' });
  }
});

app.put('/api/modules/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedModule = await prisma.module.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });
    res.json(updatedModule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update module' });
  }
});

app.delete('/api/modules/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.deleteMany({ where: { moduleId: parseInt(id) }});
    await prisma.module.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

app.get('/api/admin/articles', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: { module: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/admin/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, moduleId, published, author, seoTitle, metaDescription } = req.body;
    if (!title || !content || !moduleId) {
      return res.status(400).json({ error: 'Title, content, and module ID are required.' });
    }
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const newArticle = await prisma.article.create({
      data: {
        title, slug, content, published,
        moduleId: parseInt(moduleId, 10),
        author, seoTitle, metaDescription,
      },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article.' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, content, moduleId, published, author, seoTitle, metaDescription } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title, slug, content, published,
        moduleId: parseInt(moduleId, 10),
        author, seoTitle, metaDescription,
      },
    });
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API server listening on port ${port}`);
});
