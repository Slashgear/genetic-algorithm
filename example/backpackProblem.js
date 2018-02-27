const objects = require('./objects');
const _ = require('lodash');
const chalk = require('chalk');
const geneticAlgorithm = require('../index');

const showObjects = gene => gene.map((value, index) => value ? objects[index].name:'').filter(value => value).join(',');

const MAX_BACK_PACK_SIZE = 10;

const randomDefaultGene = Array(objects.length).fill(false).map(() => Math.random() > 0.5);


const generateRandomPopulation = () => {
    const population = [];
    for(let i = 0; i< 100000; i++) {
        population.push(_.shuffle(randomDefaultGene));
    }
    return population;
};

const rndIndex = array => Math.floor(Math.random() * array.length);

const mutation = gene => {
    const index = rndIndex(gene);
    gene[index] = !gene[index];
    return gene;
};

const fitness = gene => {
    let volume = 0;
    let value = 0;

    gene.forEach((it, index) => {
        if(it) {
            volume += objects[index].volume;
            value += objects[index].value;
        }
    });

    return volume > MAX_BACK_PACK_SIZE ? 0: value;
};

const combine = (gene1, gene2) => {
    const rnd = rndIndex(gene1);
    const child = [];
    for(let i = 0; i< gene1.length; i++) {
        if(i<=rnd) {
            child.push(gene1[i]);
        } else {
            child.push(gene2[i])
        }
    }
    return child;
};



console.log(chalk.red('Begin'));

const {bestFound} = geneticAlgorithm(500, generateRandomPopulation(), fitness, combine, mutation, 0.1);

console.log(chalk.yellow('Best travel found', showObjects(bestFound.gene), '', bestFound.fitness));