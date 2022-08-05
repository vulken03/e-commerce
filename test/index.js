const chai  = require('chai');
const chaiHttp  = require('chai-http');
const sinon  = require('sinon');
const { Sequelize } = require('sequelize');
let {performance} = require('perf_hooks');
const config = require('../configuration/config')

// const helpers = require('../helpers');

config.get('env');
const _CONSTANT = require('../utils/constant');// console.log('config',_CONFIG)
const _CONFIG = require('../configuration/config');
const sequelize = require('../database');
sequelize.sequelize.sync({ force: false, alter: false });


class Measurement{
    constructor(){
        this.performance = performance
    }
    init(){
        this.duration = null;
        this.performance.mark('a');
        console.log("performance init")
    }
    end (context){
        let testcasetitle = context.test.title;
        this.performance.mark('b');
        console.log("performance end");
        this.performance.measure(testcasetitle,'a','b');
        this.durationResponse = this.performance.getEntriesByName(testcasetitle)[0];
        
    }
    durationInSeconds = function(){
        return this.durationResponse.duration/1000;
    }
    durationInMilliSeconds  = function(){
        return this.durationResponse.duration;
    }
    assessmentId  = function(){
        return this.durationResponse.name;
    }
}
class TestUtils{
    constructor(){
        this.chai = chai;
        this.sinon = sinon;
        chai.use(chaiHttp);
        this.base_url = 'http://localhost:8080';
        this.performance = new Measurement();

        this.app = {
            _CONSTANT,
            _CONFIG, 
            _DB : sequelize
        };
        this.cache = {};/* cache can be used as an object 
                        while saving reponses or query across various 
                        directories inside test folder */
                        
        this.setFixtures();//it will set up al level set up and teardowns
    }
    activateSetup(){
        before(async function(){
            console.log('before all test cases');
        })
    }
    activateTeardown(){
        after(async function(){
            console.log('after all tests');
        })
    }
    setFixtures(){
        this.activateSetup();//it will run before any testcase of test setup
        this.activateTeardown();//it will run after whole testcase of test setup
    }
    getModel(model){
        return require('../models'+model)(sequelize,Sequelize);
    }
}



const test_util = new TestUtils()
module.exports = test_util;
