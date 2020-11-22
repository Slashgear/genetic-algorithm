const _ = require('lodash');
const chalk = require('chalk');
const distance = require('gps-distance');
const geneticAlgorithm = require('../index');
const points = require('./capitals.json');

const showTravel = listOfPoints => listOfPoints.map(p => p.name);

const fitness = listOfPoints => distance(listOfPoints.map(point => [point.lat, point.lon]));

const mutation = array => {
    const items = [...array];
    const firstRandomIndex = Math.floor(Math.random()*items.length);
    let secondRandomIndex = firstRandomIndex;
    while(secondRandomIndex === firstRandomIndex) {
        secondRandomIndex = Math.floor(Math.random()*items.length);
    } 
    const temp = items[secondRandomIndex];
    items[secondRandomIndex]= items[firstRandomIndex];
    items[firstRandomIndex] = temp;
    return items;
};

const startPopulation = [];

for(let i = 0; i< 1000; i++) {
    startPopulation.push(_.shuffle(points));
}

const combine = (gene1, gene2) => {
    const cut = Math.floor(Math.random() * gene1.length);
    const child = [];

    for(let i= 0; i< cut; i++) {
        child.push(gene1[i]);
    }

    let j = 0;
    while(child.length !== gene1.length) {
        if(!child.includes(gene2[j])) {
            child.push(gene2[j]);
        }
        j++;
    }

    return child;
};

console.log(chalk.red('Begin'));

const {bestFound} = geneticAlgorithm(1000, startPopulation, fitness, combine, mutation, 0.1);

console.log(chalk.yellow('Best travel found', showTravel(bestFound.gene), '', bestFound.fitness));
