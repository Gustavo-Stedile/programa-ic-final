const elements = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const relatorio = document.querySelector('#relatorio');

const getInputLabel = input => input.parentNode.querySelector(`label[for="${input.id}"]`);

//adiciona uma função que se resolverá quando o elemento for checado
HTMLInputElement.prototype.beenChecked = function() {
    return new Promise(res => setInterval(() => {
        if (this.checked) {
            res();
        };
    }));
}

//retorna um array com os elementos ordenados pela função map
const order = (...order) => order.map(val => elements[val]);

const highlight = rightOne => {
    elements.forEach(element => getInputLabel(element) != undefined && getInputLabel(element).classList.toggle('highlight', element === rightOne));
}

const sequencia = async (elementOrder) => {
    clean();

    let errors = 0;
    const start = new Date();

    //loop que vai executar o processamento de cada botão
    for (const rightOne of elementOrder) {
        highlight(rightOne);
        
        //executa as verificações por erros
        rightOne.onmouseleave = () => errors++;
        window.onclick = () => errors++;

        elements.forEach(element => element.onclick = ev => {
            ev.stopPropagation();

            if (element != rightOne) {
                element.checked = false;
                errors++;
            }
        });

        //trava a execução aqui e só continua quando o botão certo for checkado
        await rightOne.beenChecked();
        rightOne.onmouseleave = undefined;
    }

    return {
        duration: new Date() - start, 
        errors: errors
    }
}

const clean = () => elements.forEach(el => el.checked = false);

const applySize = size => elements.forEach(el => {
    el.className = size;
    getInputLabel(el).className = size;
});

//executa cada sequencia de acordo
const etapa = async tamanho => {
    applySize(tamanho);
    alert(`entrando na etapa de tamanho ${tamanho}`);
    relatorio.innerHTML += `<h2>${tamanho}</h2>`

    let dados = await sequencia(order(0, 1));
    relatorio.innerHTML += `<h3>linear</h3>`
    relatorio.innerHTML += `<p>duração ${dados.duration}ms<br />errors: ${dados.errors}</p>`

    dados = await sequencia(order(8, 7));
    relatorio.innerHTML += `<h3>decrescente</h3>`
    relatorio.innerHTML += `<p>duração ${dados.duration}ms<br />errors: ${dados.errors}</p>`

    dados = await sequencia(order(2, 1));
    relatorio.innerHTML += `<h3>aleatoria</h3>`
    relatorio.innerHTML += `<p>duração ${dados.duration}ms<br />errors: ${dados.errors}</p>`
}

const init = async () => {
    await etapa('pequeno');
    await etapa('medio');
    await etapa('grande');
    alert('acabou');
}
window.onload = init;