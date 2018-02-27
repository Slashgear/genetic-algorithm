const _ = require('lodash');

module.exports = function (nbOfGenerations, startPopulation, fitness, combine, mutation, mutationFactor) {
    const selectionSize = Math.ceil(startPopulation.length / 2);
    const nbToMutate = Math.ceil(startPopulation.length * mutationFactor);
    let currentPopulation = startPopulation;

    let bestFound = {
      gene: _.first(startPopulation),
      fitness: fitness(_.first(startPopulation))
    };

    for(let i = 0; i< nbOfGenerations; i ++) {
        const evalutatePopulation = currentPopulation.map(elem => ({
            gene: elem,
            fitness: fitness(elem),
        }));


        const sortedPopulation = _.orderBy(evalutatePopulation, elem => elem.fitness, 'desc');

        // We select the best from the generation
        const selection = sortedPopulation.slice(0, selectionSize);

        const bestFromGeneration = _.first(selection);
        if (bestFromGeneration.fitness > bestFound.fitness) {
            bestFound = bestFromGeneration
        }

        let childrens = [];

        for(let j = 0; j< selection.length; j+=2) {
            childrens.push(combine(selection[j].gene, selection[j+1].gene))
            childrens.push(combine(selection[j].gene, selection[j+1].gene))
        }

        _.sampleSize(childrens, nbToMutate).forEach(elem => {
            const mutatedGene = mutation(elem);

            return {
                gene: mutatedGene,
                fitness: fitness(mutatedGene)
            }
        });


        currentPopulation = childrens;
    }

    return { bestFound }
};