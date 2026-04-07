/*
Starter da Aula 4

Construa a logica do zero, seguindo o EXERCICIO.md.

Ordem sugerida:
1. Selecionar os elementos do DOM.
2. Criar a funcao validateTitle(title).
3. Criar o array items e o contador nextId.
4. Criar a funcao createStudyItem(item).
5. Tratar o submit do formulario.
6. Tratar o click da lista para remover itens com delegacao.

Meta da aula:
- formulario
- lista dinamica
- validacao simples
- uso de dataset
- delegacao de eventos
*/

const items = [];
let nextId = 1;
let lastUserId = "";

const form = document.getElementById("study-form");
const input = document.getElementById("study-input");
const feedback = document.getElementById("feedback");


const apiForm = document.getElementById("api-form");
const apiUserIdInput = document.getElementById("api-user-id");
const apiFeedback = document.getElementById("api-feedback");
const statusMassage = document.getElementById("status-message");
const reloadButton = document.getElementById("reload-button");
const apiSubmitButton = document.querySelector("button[type='submit']");

const list = document.getElementById("study-list");
const emptyState = document.getElementById("empty-state");

function setFeedback(message , type = ""){
    feedback.textContent = message;
    feedback.classList = "feedback"
    if(type){
        feedback.classList.add(`feedback--${type}`);
    }
}

function setApiFeedback(message , type = ""){
    apiFeedback.textContent = message;
    apiFeedback.classList = "feedback"
    if(type){
        apiFeedback.classList.add(`feedback--${type}`);
    }
}

function validateTitle(item){
    if(item.length === 0){
        return "Digite uma atividade";

    }
    if(item.length < 3){
        return "use pelo menos 3 caracteres"
    }
    return"";
}
function setApiLoading(isLoading){
    apiSubmitButton.disabled = isLoading;   
    reloadButton.disabled = isLoading;
    apiUserIdInput.disabled = isLoading;
    apiSubmitButton.textContent = isLoading ? "Carregando..." : "Buscar Sugestoes";
    reloadButton.textContent = isLoading ? "Atualizando..." : "Recarregar Ultima Busca";
}

function createStudyItem(item){
  const li = document.createElement("li");
  li.className = "study-item";
  li.dataset.id = String(item.id);  

  const title = document.createElement("p");
  title.classList = "study-item-title";
  title.textContent = item.title;
  
  const content = document.createElement("div");
  content.className = "study-item__content";
  
  const top = document.createElement("div");
  top.className = "study-item__top";

  const badge = document.createElement("span");
  badge.className = item.source === "api" ? "badge badge--api" : "badge badge--manual";
  badge.textContent = item.source === "api" ? "API" : "Manual";

  const meta = document.createElement("p");
  meta.classList = "study-item__meta";
  
  if(item.source === "api"){
    const statusLabel = item.completed ? "Concluida" : "Pendente";
    meta.textContent = `sugestao remota | userId: ${item.userId} | ${statusLabel}`;
    } else {
    meta.textContent = "item criado manualmente";
    }
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn--danger";
  removeButton.textContent = "remover";
  removeButton.dataset.action = "remove";
  top.append(title , badge);
  content.append(top, meta);
  li.append(content , removeButton);
  return li;
}

function renderList(){
    list.replaceChildren(); //apaga todos os filhos

    if(items.length === 0){
        emptyState.hidden = false;//mensagem dizendo que a lista é vazia
        renderList;
    }

    emptyState.hidden = true;

    items.forEach((item) => {
        list.appendChild(createStudyItem(item)) //recria os items
    })
}
function handleFormSubmit(event){
    event.preventDefault(); //evita recaregar a lista
    const title = input.value.trim(); 
    const errorMesage = validateTitle(title);

    if(errorMesage){
        setFeedback(errorMesage , "error");
        return;
    }
    items.unshift({
        id : nextId++,
        title,
    });
    nextId += 1;
    form.reset();
    input.focus();
    setFeedback("item adicionado com sucesso!", "Sucesso");
    renderList();
    }

function handleListClick(event){
    const button = event.target.closest("button[data-action]");
    if(!button){
        return
    }
const itemElement = button.closest(".study-item")

if(!itemElement){
    return;
}

const id = Number(itemElement.dataset.id);
const index = items.findIndex(item => item.id === id);

const removedTitle = items[index].title;
items.splice(index,1);
setFeedback(`item "${removedTitle}"removido com sucesso`, "success");
renderList();
} 
form.addEventListener("submit", handleFormSubmit);
list.addEventListener("click", handleListClick);
input.addEventListener("input", () => {
   if(feedback.classList.contains("feedback--error")){
    setFeedback("");
   }
});
renderList();


