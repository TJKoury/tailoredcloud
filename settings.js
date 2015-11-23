module.exports = {

  dir:{
    development:'/opt/software/tailoredcloud',
    production:'/var/node/'
  },
  ports:{
    development:{
      http:8081,
      https:8444,
    },
    production:{
      http:8080,
      https:8443,
    },
  }

};
