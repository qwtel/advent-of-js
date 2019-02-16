#!/usr/bin/env node --experimental-modules

import { read, add } from './util';

(async () => {
    const input = await read(process.stdin);

    const treeInput = input.trim().split(' ').map(Number);

    // 1
    function walkTree(it) {
        const [a, b] = [it.next().value, it.next().value];
        let num = 0;
        for (let i = 0; i < a; i++) num += walkTree(it);
        for (let j = 0; j < b; j++) num += it.next().value;
        return num;
    }

    console.log(walkTree(treeInput[Symbol.iterator]()));

    // 2
    function buildTree(it, c = 0) {
        const letter = process.env.DEBUG ? String.fromCharCode(c + 65) : null;
        const children = [];
        const meta = [];
        const [a, b] = [it.next().value, it.next().value];
        for (let i = 0; i < a; i++) children.push(buildTree(it, ++c));
        for (let j = 0; j < b; j++) meta.push(it.next().value);
        return process.env.DEBUG
            ? { letter, children, meta }
            : { children, meta };

    }

    function countStuff({ children, meta }) {
        if (!children.length) return meta.reduce(add, 0);
        return meta
            .map(i => children[i - 1])
            .filter(x => x)
            .map(c => countStuff(c))
            .reduce(add, 0);
    }

    const tree = buildTree(treeInput[Symbol.iterator]());
    if (process.env.DEBUG) console.log(tree);

    console.log(countStuff(tree));
})();
