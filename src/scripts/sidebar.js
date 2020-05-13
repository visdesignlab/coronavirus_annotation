import * as d3 from 'd3';

export function renderNav(div, nav){

    let buttons = d3.select(div).selectAll('button').data(nav).join('button');
    buttons.text(d=> d.key);
    buttons.classed('btn btn-secondary', true);
    buttons.attr('id', d=> `button-${d.key}`);
    buttons.on('click', (d, i, n)=> {
    if(d.key === 'Draw'){
        if(d.selectedBool === false){
            d.selectedBool = true;
            console.log('how do you pause the video');
            console.log(n[i])
            d.callback();
        }else{
            d.selectedBool = false;
            console.log(n[i])
            d.callback();
        }
    }else{
        d.callback();
    }
        
        
    });
}