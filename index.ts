import * as _ from "lodash";

type Gene = Array<unknown>

interface BestFound {
    gene:Gene
    fitness:number
}

interface Result {
    bestFound: BestFound
}

interface Fitness { (items:Gene): number }

interface Combine { (geneA: Gene, geneB: Gene): Gene}

interface Mutation { (gene:Gene): Gene}

/**
 * Application of Genetic Algorithm on an array of genes
 *
 * @param nbOfGenerations population generation counter
 * @param startPopulation list of start population genes
 * @param fitness function to evaluate the gene value
 * @param combine generator of child based on two genes
 * @param mutation generator of random inversion in gene to create mutation
 * @param mutationFactor ratio of population to mutate of each generation cycle
 */
function geneticAlgorithm(nbOfGenerations:number, startPopulation:Gene, fitness:Fitness, combine: Combine, mutation:Mutation, mutationFactor:number):Result {
    const selectionSize = Math.ceil(startPopulation.length / 2);
    const nbToMutate = Math.ceil(startPopulation.length * mutationFactor);
    let currentPopulation = startPopulation;

    let bestFound = {
      gene: _.first(startPopulation),
      fitness: fitness(_.first(startPopulation))
    };

    for(let i = 0; i< nbOfGenerations; i ++) {
        const evalutatePopulation = currentPopulation.map((elem:Gene) => ({
            gene: elem,
            fitness: fitness(elem),
        }));

        const sortedPopulation = _.orderBy(evalutatePopulation, elem => elem.fitness);

        // We select the best from the generation
        const selection = sortedPopulation.slice(0, selectionSize);

        const bestFromGeneration = _.first(selection);
        if (bestFromGeneration.fitness < bestFound.fitness) {
            bestFound = bestFromGeneration
        }

        const childrens = [];

        for(let j = 0; j< selection.length; j+=2) {
            childrens.push(combine(selection[j].gene, selection[j+1].gene))
            childrens.push(combine(selection[j].gene, selection[j+1].gene))
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
}

export = geneticAlgorithm