module.exports = {
  "servercertificate": {
    "certificate": "certificates/cert.pem"
  },
  dir:{
    dev:'/opt/software/tailoredcloud',
    prod:'/var/node/'
  },
  environment:"dev",
  ports:{
    dev:{
      http:8081,
      https:8444,
    },
    prod:{
      http:8080,
      https:8443,
    },
  }

};
