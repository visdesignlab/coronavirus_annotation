import * as d3 from 'd3';

export function renderNav(div, nav){

    let buttons = d3.select(div).selectAll('button').data(nav).join('button');
    buttons.text(d=> d.key);
    buttons.classed('btn btn-secondary', true);
    buttons.on('click', (d)=> d.callback());
}