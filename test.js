const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('./app.js');
const db = require('./db.js'); // Use the test database

describe('Your Node.js Application', () => {
  // Create a before hook to run before tests
  before((done) => {
    // Establish a connection to the test database
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to the test database:', err);
        done(err);
      } else {
        console.log('Connected to the test database');
        done();
      }
    });
  });

  //Sample unit test for the login route
  it('Should login successfully with valid credentials', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'samir@mail.ru', password: '0554848035' })
      .end((err, res) => {
        expect(res.status).to.equal(200); // Replace with the expected status code
        // Add more assertions as needed
        done();
      });
  });

  // Sample unit test for the registration route
  it('Should register successfully with valid data', (done) => {
    request(app)
      .post('/registration')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=John&email=john@example.com&password=12345678') // Send valid data as a query string
      .end((err, res) => {
        expect(res.status).to.equal(302); // Replace with the expected status code
        // Add more assertions as needed
        done();
      });
  });

  // Add more tests for other routes and functions as needed

  // Close the test database connection after all tests
  after((done) => {
    db.end((err) => {
      if (err) {
        console.error('Error closing test database connection:', err);
        done(err);
      } else {
        console.log('Closed test database connection');
        done();
      }
    });
  });
});
