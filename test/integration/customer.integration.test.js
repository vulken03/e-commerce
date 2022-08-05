const test_util = require('../index')
describe('flow wise test cases', function () {
    this.timeout();
    const base_url = test_util.base_url;
  let user= {
    username:"VDP",
    password:"Viraj@123",
    email:"vaddddddppppppp@brainvire.com", 
    name:"Viraj",
    phoneno:"9727439464",
    city:"Ahmedabad",
    pincode:"380005", 
    state:"Gujarat",
    country:"India", 
    address:"Kabir chowk" 
}
        it('Customer Registration', async function () {
            let registerResponse = await test_util.chai.request(base_url)
                .post(`/customer_signup`)
                .set('content-type', 'application/json')
                .send(user)
            test_util.chai.assert.strictEqual(registerResponse.body.code,200, "error");
        });
        it(`Deny Registration of customer with Same Email id `, async function () {
            let res = await test_util.chai.request(base_url)
                .post(`/customer_signup`)
                .set('content-type', 'application/json')
                .send(user)
            test_util.chai.assert.strictEqual(res.body.code,500, 'we are not getting expected status:' + res.body.success)
             })

        it('Deny Login Until User Verification done', async function () {

            let response = await test_util.chai.request(base_url)
                .post(`/customer_login`)
                .set('content-type', 'application/json')
                .send({ email: user.email,password:user.password})
            test_util.chai.assert.strictEqual(response.body.success,400, "error");
        })
    
        it('Successful User Verfication', async function () {
            let response = await test_util.chai.request(base_url)
                .post(`/email_verify`)
                .set('content-type', 'application/json')
                .send({ email: user.email})
            test_util.chai.expect(response.body.code).to.equal(200);
        })
        it('Successful User Login', async function () {
            test_util.performance.init();
            let response = await test_util.chai.request(base_url)
                .post(`/customer_login`)
                .set('content-type', 'application/json')
                .send({ email:user.email,password:user.password})
            test_util.performance.end(this);
            console.log('latency', test_util.performance.durationInMilliSeconds(), 'ms', test_util.performance.durationInSeconds(), 'seconds');
            console.log('last measurement assessment id', test_util.performance.assessmentId())
            test_util.chai.assert.strictEqual(test_util.performance.durationInMilliSeconds() <200, true, 'time is higher than 100 milliseconds')
            console.log(response.body.data.genrateToken);
            test_util.chai.assert.strictEqual(response.body.code, 200, "error");
            test_util.chai.expect(response.body.code).to.equal(200);
    
        })
})
    