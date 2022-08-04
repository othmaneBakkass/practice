import './style.css';

const toDoListContainer = document.querySelector('.js-to-do-items-container');

// add to-do list item
const toDoInputWrapper = document.querySelector(
  '.js-to-do-contentInput--wrapper'
);
const toDoInput = document.querySelector('.js-to-do-contentInput');
const addToDoBtn = document.querySelector('.js-add-to-do-btn');
const toDoInputCloseBtn = document.querySelector('.js-to-do-input-close-btn');

// tags modal
const tagsModal = document.querySelector('.js-tags-modal');
const tagsModalCloseBtn = document.querySelector('.js-tags-form-close-btn');
const tagsSelectionConfirmBtn = document.querySelector(
  '.js-tags-selection-confirm-btn'
);

const tagsObject = {
  1: { content: 'important', color: 'bg-red-500' },
  2: { content: 'not important', color: 'bg-orange-500' },
  3: { content: 'in progress', color: 'bg-blue-500' },
  4: { content: 'completed', color: 'bg-green-500' },
  5: { content: 'urgent', color: 'bg-violet-500' },
  6: { content: 'not urgent', color: 'bg-pink-500' },
};
const allTags = Object.entries(tagsObject);
const listDB = new Map();
let listItemID = 0;

class ToDoItem {
  id;
  title;
  tags;

  constructor(id, title, tags) {
    this.id = id;
    this.title = title;
    this.tags = tags;
  }

  addItemToDB = (list) => {
    list.set(this.id, this);
    return this;
  };

  renderItemToUI = (listContainer) => {
    const template = `
    <div data-item-id="${this.id}" class="js-listItem flex flex-col justify-center items-center p-5 w-full border-block-gray-100">
      <div class="flex justify-between items-center w-full gap-2">
          <p class="break-words">
            ${this.title}
          </p>
        <div class="relative">
            <div 
              class="flex justify-center items-center w-6 h-6 rounded-full hover:cursor-pointer hover:bg-gray-100">
              <span data-item-id="${this.id}" class="js-lisItem__options_btn material-symbols-rounded text-neutral-500"> more_vert
              </span>
            </div>
            <ul data-animate='false' data-item-id="${this.id}"
              class="js-lisItem__options an-fade-up an-fade-up-start an-transition-fade absolute st-p-top-1 left-1/2 max-h-fit w-28 ease-in duration-150 motion-reduce:transition-none rounded bg-white drop-shadow-lg">
              <li data-item-id="${this.id}" class="js-remove-task py-2 px-2 hover:cursor-pointer hover:bg-gray-100">remove task</li>
              <li data-item-id="${this.id}" class="js-add-tags pb-2 px-2 hover:cursor-pointer hover:bg-gray-100" >add tags</li>
            </ul>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center pt-5 gap-y-4 w-full">
          <div class="flex justify-between items-center w-full">
            <h5 class="text-lg font-medium">Tags</h5>
            <div
              class="flex justify-center items-center w-6 h-6 rounded-full hover:cursor-pointer hover:bg-gray-100">
              <span data-item-id="${this.id}" data-toggle-animation="false"
                class="js-tags-arrow-icon material-symbols-rounded text-neutral-500 transition-transform duration-150 ease-in">expand_more</span>
            </div>
          </div>
          <div data-item-id="${this.id}" class="js-tags-list-container flex justify-start items-center flex-wrap gap-4 w-full ease-in duration-150 motion-reduce:transition-none overflow-hidden">
          
          </div>
      </div>
    </div>
    `;
    listContainer.innerHTML += template;
    return this;
  };
}

const getItem = (itemID) => listDB.get(Number(itemID));
const removeItem = (itemID) => listDB.delete(Number(itemID));

const createItem = (content) => {
  const item = new ToDoItem(listItemID++, content, new Set());
  return item;
};

toDoListContainer.addEventListener('click', (event) => {
  const { target } = event;

  if (target.classList.contains('js-lisItem__options_btn')) {
    const itemID = target.getAttribute('data-item-id');
    animateOptionsMenu(itemID);
  }

  if (target.classList.contains('js-tags-arrow-icon')) {
    const itemID = target.getAttribute('data-item-id');

    const tagsListContainer = document.querySelector(
      `.js-tags-list-container[data-item-id="${itemID}"]`
    );
    const arrowIcon = document.querySelector(
      `.js-tags-arrow-icon[data-item-id="${itemID}"]`
    );
    arrowIcon.classList.toggle('rotate-180');

    animateTagsDropDown(arrowIcon, tagsListContainer);
  }

  if (target.classList.contains('js-add-tags')) {
    const itemID = target.getAttribute('data-item-id');
    animateOptionsMenu(itemID);
    tagsModal.classList.remove('invisible', 'opacity-0');
    tagsModal.setAttribute('data-called-by-item', itemID);
  }

  if (target.classList.contains('js-remove-task')) {
    const itemID = target.getAttribute('data-item-id');
    removeListItem(itemID);
  }

  if (target.classList.contains('js-list-item-tag-remove-btn')) {
    const itemID = target.getAttribute('data-item-id');
    const tagID = target.getAttribute('data-tag-id');
    deleteTag(itemID, tagID);
    removeTagFromUI(itemID, tagID);
  }
});

// animation
function animateOptionsMenu(itemID) {
  const toDoListOptions = document.querySelector(
    `.js-lisItem__options[data-item-id="${itemID}"]`
  );

  toDoListOptions.setAttribute('data-animate', 'true');
  toDoListOptions.classList.toggle('an-fade-up-start');
  toDoListOptions.classList.toggle('an-fade-up-end');
}

function animateTagsDropDown(btn, container) {
  const toggleAnimation = btn.getAttribute('data-toggle-animation');

  if (toggleAnimation === 'true') {
    const containerHeight = container.scrollHeight;
    setElementHeightToScrollHeight(container, containerHeight);
    btn.setAttribute('data-toggle-animation', 'false');
  } else {
    container.style.height = '0px';
    btn.setAttribute('data-toggle-animation', 'true');
  }
}

const setElementHeightToScrollHeight = (element, elementHeight) => {
  element.style.height = `${elementHeight}px`;
};

// add list item
addToDoBtn.addEventListener('click', () => {
  toDoInputWrapper.classList.remove('st-p-top--100');
  toDoInputWrapper.classList.add('top-6');
  toDoInput.focus();
});

toDoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && toDoInput.value.length !== 0) {
    const listItem = createItem(toDoInput.value);
    listItem.addItemToDB(listDB).renderItemToUI(toDoListContainer);
    toDoInput.value = '';
  }
});

toDoInputCloseBtn.addEventListener('click', () => {
  toDoInputWrapper.classList.add('st-p-top--100');
  toDoInputWrapper.classList.remove('top-6');
});

tagsModalCloseBtn.addEventListener('click', () => {
  tagsModal.classList.add('invisible', 'opacity-0');
});

function removeListItem(itemID) {
  const item = document.querySelector(`.js-listItem[data-item-id="${itemID}"]`);
  item.remove();
  removeItem(itemID);
}

// add tags
tagsSelectionConfirmBtn.addEventListener('click', () => {
  const selectedTagsInputs = document.querySelectorAll('.js-tag:checked');
  if (selectedTagsInputs === undefined || selectedTagsInputs === null) return;
  const selectedTags = inputsListToValuesArray(selectedTagsInputs);
  const itemID = tagsModal.getAttribute('data-called-by-item');
  const item = getItem(itemID);
  updateItemTags(item, selectedTags);
  renderNewTags(itemID, selectedTags, allTags);
});

function updateItemTags(item, newTags) {
  item.tags = new Set(newTags);
}

function renderNewTags(itemID, selectedTags, allTagsArray) {
  const item = document.querySelector(
    `.js-tags-list-container[data-item-id="${itemID}"]`
  );
  const tags = allTagsArray.filter((tag) => {
    if (selectedTags.includes(tag[0])) {
      return true;
    }
    return false;
  });

  let template = '';
  tags.forEach((tag) => {
    template += `
                <div data-item-id="${itemID}" data-tag-id="${tag[0]}" class="js-listItem_tagsContainer_tagWrapper flex justify-between items-center ${tag[1].color} py-1 px-2 gap-1 rounded-full">
                  <p class="text-white text-sm">${tag[1].content}</p>
                  <div class="flex justify-center items-center w-4 h-4 rounded-full hover:cursor-pointer hover:bg-gray-100/30">
                    <span data-item-id="${itemID}" data-tag-id="${tag[0]}" class="js-list-item-tag-remove-btn material-symbols-rounded text-sm text-neutral-50">close</span>
                  </div>
                </div>
    `;
  });

  item.innerHTML = template;
}

function removeTagFromUI(itemID, tagID) {
  const tagWrapper = document.querySelector(
    `.js-listItem_tagsContainer_tagWrapper[data-item-id="${itemID}"][data-tag-id="${tagID}"]`
  );
  tagWrapper.remove();
}
function deleteTag(itemID, tagID) {
  const listItem = getItem(itemID);
  listItem.tags.delete(tagID);
}

function inputsListToValuesArray(tagsList) {
  const tagsArray = [];
  tagsList.forEach((el) => tagsArray.push(el.value));
  return tagsArray;
}
