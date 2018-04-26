class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log('Hello.');
    }
}

class Child extends Person {
    constructor(name, age, hobby) {
        super(name, age);
        this.hobby = hobby;
    }
    sayHi() {
        console.log('Hi.');
    }
    sayHello() {
        this.sayHi();
        console.log('Hello, I am ' + this.name);
    }
}

const teo = new Child('Teo', 10, 'Plane');
teo.sayHello();
// teo.sayHi();
// console.log(teo);
