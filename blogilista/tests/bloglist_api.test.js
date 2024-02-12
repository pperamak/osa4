const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)


  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUser)
  })

  test('GET returns the right number of blogs', async () => {
    const response=await api.get('/api/blogs').expect(200)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the identifying field of returned blogs is defined and named "id"', async () => {
    const response=await api.get('/api/blogs').expect(200)
    const blogs = response.body
    blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
  })
  
  test('a valid blog can be added', async ()=>{
    const response=await api.post('/api/login').send({username: helper.initialUser.username, password: helper.initialUser.password})
    const token =response.body.token
    const newBlog={
        title: 'Shenanigans',
        author: 'Paivio',
        url: 'Gunrise.org',
        likes: 88
    }
    //console.log(token)
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(newBlog.title)
  })

  test('if token not given, response 401', async ()=>{
    const newBlog={
      title: 'Shenanigans',
      author: 'Paivio',
      url: 'Gunrise.org',
      likes: 88
  }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  })

  test('if not given, the field "likes" of a new blog is set to 0', async ()=>{
    const response=await api.post('/api/login').send({username: helper.initialUser.username, password: helper.initialUser.password})
    const token =response.body.token
    const newBlog={
        title: 'Nollat',
        author: 'RahaLafa',
        url: 'Tammi.sto',
    }
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const bIDB=await helper.blogsInDb()
     // Use find to locate the blog with title "Nollat"
    const nollatBlog = bIDB.find(blog => blog.title === 'Nollat');

     // Check if the blog with title "Nollat" is found
     expect(nollatBlog).toBeDefined();
 
     // If found, check that its likes property is set to 0
     if (nollatBlog) {
       expect(nollatBlog.likes).toBe(0);
     }
  })

  test('if title or url are not defined, response status code 400 given', async ()=>{
    const response=await api.post('/api/login').send({username: helper.initialUser.username, password: helper.initialUser.password})
    const token =response.body.token
    const newBlog={
        author: 'bestGirl',
        url: 'Tapio.sto',
        likes: 2
    }
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  })

  test('an individual blog can be deleted', async ()=>{
    const blogsAtStart=await helper.blogsInDb()
    const id=blogsAtStart[0].id
    const response=await api.post('/api/login').send({username: helper.initialUser.username, password: helper.initialUser.password})
    const token =response.body.token  
    await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    const blogsAtEnd=await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('update for blogs works', async ()=>{
    const blogsAtStart=await helper.blogsInDb()
    const blogToUpdate=blogsAtStart[0]

    const updatedBlog={
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 666
    }
  const response =  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)


  expect(response.body.likes).toBe(666)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })