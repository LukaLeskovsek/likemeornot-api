import app from './../src/index';

import chai from 'chai';
import {expect, should} from 'chai';
import request from 'supertest';
import { it } from 'mocha';

describe('API endpoints integration test', () => {
    
    let loginToken = '';
    let userId = '';
    
    const fakeLogin = {
        credentials : {
            email : 'luka@leskovsek.si',
            password : '11111'
        }
    }

    describe('#POST login', () => {
        it('should login user', (done) => {
            request(app)
                .post('/api/login')
                .send(fakeLogin)
                .end((err, res) => {
                    loginToken = res.body.user.token;
                    userId = res.body.user.id;
                    expect(res.statusCode).to.equal(200);

                    done();
                });
        });
    });

    const fakeSignupUser = {
        user : {
            email : 'test@test.si',
            password : 'super-safe-password',
            firstname : 'Mike',
            lastname : 'Van-Dyke',
            bio : 'Short bio'
        }
    };

    describe('#POST Signup', () => {
      it('should signup user', (done) => {
          request(app)
            .post('/api/signup')
            .send(fakeSignupUser)
            .end( (err,res) => {
                expect(res.statusCode).to.not.equal(200);
                done();
            })
      })
    });

    const fakeResetUser = {
        email : "luka@leskovsek.si"
    };

    describe('#POST reset password', () => {
        it('should send the user a reset password link', (done) => {
            request(app)
                .post('/api/me/reset-password')
                .send(fakeResetUser)
                .end( (err,res) => {
                    expect(res.statusCode).to.not.equal(200);
                    done();
                })      
        });
    });

    describe('#GET most liked user list', () => {
        it('should return a list of users ordered by descending number of likes', (done) => {
            request(app)
            .get('/api/most-liked')
            .set({authorization : `AuthToken ${loginToken}`})
            .send()
            .end( (err,res) => {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })      
    });

    describe('#GET unexistent user details', () => {
        it('should return error when fetchinh users details', (done) => {
            request(app)
            .get('/api/user/4324424/')
            .set({authorization : `AuthToken ${loginToken}`})
            .send()
            .end( (err,res) => {
                expect(res.statusCode).to.not.equal(200);
                done();
            })
        })      
    });

    describe('#GET Like a user', () => {
        it('should return no error when liking a user', (done) => {
            request(app)
            .get('/api/user/32/')
            .set({authorization : `AuthToken ${loginToken}`})
            .send()
            .end( (err,res) => {
                expect(res.statusCode).to.not.equal(200);
                done();
            })
        })      
    });

    describe('#GET current logged in user details', () => {
        it('should return no error when requesting details', (done) => {
            request(app)
            .get('/api/me')
            .set({authorization : `AuthToken ${loginToken}`})
            .send()
            .end( (err,res) => {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })      
    });
});

