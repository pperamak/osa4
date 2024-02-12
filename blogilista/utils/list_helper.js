const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }
  
  module.exports = {
    dummy
  }

const totalLikes = (blogs)=> {
 return blogs.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.likes;
    }, 0)
  }

const favoriteBlog=(blogs)=>{
  if (!Array.isArray(blogs) || blogs.length === 0) {
    // Handle invalid input (not an array or an empty array)
    return null;
  }

  // Initialize with the first object in the array
  let maxLikesObject = blogs[0];

  // Iterate through the array to find the object with the max "likes"
  for (let i = 1; i < blogs.length; i++) {
    const currentObject = blogs[i];

    if (currentObject.likes > maxLikesObject.likes) {
      maxLikesObject = currentObject;
    }
  }

  return { title: maxLikesObject.title, author: maxLikesObject.author, likes: maxLikesObject.likes };
}

const mostBlogs=(blogs)=>{
  
    // Group blogs by author
    const blogsByAuthor = _.groupBy(blogs, 'author')
  
    // Find the author with the most blogs
    const mostProlificAuthor = _.maxBy(_.keys(blogsByAuthor), author => blogsByAuthor[author].length)
  
    // Return an object with the author and the number of blogs authored
    return {
      author: mostProlificAuthor,
      blogs: blogsByAuthor[mostProlificAuthor].length,
    }
}

const mostLikes=(blogs)=>{
  // Group blogs by author
  const blogsByAuthor = _.groupBy(blogs, 'author')

  // Calculate total likes for each author
  const likesByAuthor = _.mapValues(blogsByAuthor, blogs => _.sumBy(blogs, 'likes'))

  // Find the author with the most likes
  const mostLikedAuthor = _.maxBy(_.keys(likesByAuthor), author => likesByAuthor[author])

  // Return an object with the author and the total likes
  return {
    author: mostLikedAuthor,
    likes: likesByAuthor[mostLikedAuthor],
  }
}


module.exports={
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}