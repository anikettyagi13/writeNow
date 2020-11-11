export const clearCheck=(para)=>{
    para=para.replace(/(\(\*\o\))/g,'<strong>')
    para=para.replace(/(\(\.\*\o\))/g,'</strong>')
    para=para.replace(/(\(\*\i\))/g,'<em>')
    para=para.replace(/(\(\.\*\i\))/g,'</em>')
    para=para.replace(/(\(\*\u\))/g,'<u>')
    para=para.replace(/(\(\.\*\u\))/g,'</u>')
    return clearList(para)
}

export const clearList=(para)=>{
    para = para.replace(/(\(\*\.\))/g,'<ul style={{textAlign:"left"}}><li>')
    para = para.replace(/(\(\.\*\))/g,'</li></ul>')
    return para;
}
