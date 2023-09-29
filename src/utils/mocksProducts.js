import { faker } from '@faker-js/faker'

const owners = ['admin', 'facjohan@hotmail.com'];

export const generateProducts = () => {
    const randomOwnerIndex = faker.number.int({ min: 0, max: owners.length - 1 });
    const owner = owners[randomOwnerIndex]

    return {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: `${faker.number.int({ min: 10, max: 100 })}${faker.string.alpha({ length: 5, casing: 'upper' })}`,
        price: parseFloat(faker.commerce.price()),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: faker.image.url(),
        owner: owner
    }
}