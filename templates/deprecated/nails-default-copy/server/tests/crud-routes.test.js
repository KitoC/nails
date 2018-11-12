const {endpoints} = require("./config/_server-config");

let token = null
let userDetails = null
let product = null


const crud = ({chai, server, should}, {endpoint}) => {




    describe(`\n ${endpoint} CRUD ops`, function () {



// Test for creating a new product - CREATE
        describe('POST /products', function () {
            it('Purchaser Account product creation', function (done) {
                this.timeout(15000)
                chai.request(server)
                    .post('/products')
                    .set('Authorization', `Bearer ${token}`)
                    .set('CurrentUser', userDetails)
                    .send({
                        companyId: userDetails.company._id,
                        price: 4.50,
                        productId: 'KS05',
                        name: 'Flour',
                        description: 'Its a bag of flour',
                        categories: ['Baking Goods', 'Raw Materials'],
                        tags: ['Organic', 'Wholemeal Flour'],
                        stockQTY: 20
                    })
                    .end((err, res) => {

                        should.equal(err, null)
                        res.should.have.status(200)

                        res.body.should.be.a('object')
                        res.body.should.have.property('_id')
                        
                        res.body.should.have.property('companyId')
                        res.body.companyId.should.equal(userDetails.company._id)

                        res.body.should.have.property('price')
                        res.body.price.should.be.a('number')
                        res.body.price.should.equal(4.50)

                        res.body.should.have.property('name')
                        res.body.name.should.equal('Flour')

                        res.body.should.have.property('description')
                        res.body.description.should.equal('Its a bag of flour')

                        res.body.should.have.property('categories')
                        res.body.categories.should.be.a('array')

                        res.body.should.have.property('tags')
                        res.body.tags.should.be.a('array')
                        

                        done()
                    })
            })

        })




// Test for .find() all products - READ (all)
        describe('GET /products', function () {
            it('should list ALL products in DB GET', function(done) {
                chai.request(server)
                    .get('/products')
                    .set('Authorization', `Bearer ${token}`)

                    .end((err, res) => {
                        should.equal(err, null)
                        res.should.have.status(200)

                        res.body.should.be.a('array');

                        res.body[2].should.be.a('object')
                        res.body[2].should.have.property('_id')

                        res.body[2].should.have.property('price')
                        res.body[2].price.should.be.a('number')

                        res.body[2].should.have.property('name')
                        res.body[2].name.should.equal('Flour')

                        res.body[2].should.have.property('description')
                        res.body[2].description.should.equal('Its a bag of flour')

                        res.body[2].should.have.property('categories')
                        res.body[2].categories.should.be.a('array')

                        res.body[2].should.have.property('tags')
                        res.body[2].tags.should.be.a('array')

                        product = res.body[2]

                        done()
                    })
            });
        })

        
// Test for .findByID() product - READ (specific)
        // describe('GET /products/:id', function () {
        //     it('should list a SINGLE product in DB GET', function (done) {
        //         chai.request(server)
        //             .get(`/products/${product._id}`)
        //             .set('Authorization', `Bearer ${token}`)
        //             .send({ _id: product._id })


        //             .end((err, res) => {
        //                 should.equal(err, null)
        //                 res.should.have.status(200)

 
        //                 res.body.should.be.a('object')
        //                 res.body.should.have.property('_id')

        //                 res.body.should.have.property('companyId')
        //                 res.body.companyId.should.equal(userDetails.company._id)

        //                 res.body.should.have.property('price')
        //                 res.body.price.should.be.a('number')

        //                 res.body.should.have.property('name')
        //                 res.body.name.should.equal('Flour')

        //                 res.body.should.have.property('description')
        //                 res.body.description.should.equal('Its a bag of flour')

        //                 res.body.should.have.property('categories')
        //                 res.body.categories.should.be.a('array')

        //                 res.body.should.have.property('tags')
        //                 res.body.tags.should.be.a('array')
                        
        //                 done()
        //             })
        //     });
        // })

// Test for .findByIdAndUpdate() a targeted product - UPDATE
        describe('PUT /products/:id', function () {
            it('should update a targeted product provided a unique :id is given ', function(done) {
                chai.request(server)
                    .put(`/products/${product._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('user', userDetails)
                    .send({
                        companyId: product.companyId,
                        description: 'My flour is now organic so I have triple the price',
                        price: 13.50
                    })

                    .end((err, res) => {
                        should.equal(err, null)
                        res.should.have.status(200)

                        res.body.should.be.a('object')
                        res.body.should.have.property('_id')

                        res.body.should.have.property('price')
                        res.body.price.should.be.a('number')
                        res.body.price.should.equal(13.50)



                        res.body.should.have.property('description')
                        res.body.description.should.equal('My flour is now organic so I have triple the price')


                        done()
                    })
            });

        })

        // Test for .findByIdAndRemove a targeted product - DELETE
        describe('DELETE /products/:id', function () {
            it('should delete a targeted post provided a unique :id is given', function (done) {
                chai.request(server)
                    .delete(`/products/${product._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('user', userDetails)
                    .send({companyId: product.companyId})

                    .end((err, res) => {
                        res.should.have.status(204)
                        done()
                    })
            });

            it('This checks if the post has been deleted or not', function (done) {
                chai.request(server)
                    .get(`/products/${product._id}`)
                    .set('Authorization', `Bearer ${token}`)

                    .end((err, res) => {
                        res.should.have.status(404)
                        done()

                    })
            });

        })




    });
}


module.exports = crud
