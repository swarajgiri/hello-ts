export default {
  port: process.env.PORT || 8080,
  db: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myapp',
      options: {
        useNewUrlParser: true
      }
    },
  }
}