import Choices from '../../js/libs/choices';

export default () => {
  const inputs = {
    locale: document.querySelector('.js-locale > select'),
    comparator: document.querySelector('.js-comparator > select'),
    cost: document.querySelector('.js-cost > input'),
    cardClass: document.querySelector('.js-class > select'),
    type: document.querySelector('.js-type > select'),
    submit: document.querySelector('.js-submit'),
  };

  const filterData = {
    setDefault() {
      this.locale = 'en';
      this.comparator = '<=';
      this.cost = 10;
      this.cardClass = [];
      this.type = [];
    },
  };

  // for humans
  const valuesMapping = {
    locale: {
      0: 'en',
      1: 'de',
      2: 'es',
      3: 'fr',
      4: 'it',
      5: 'pl',
      6: 'pt',
      7: 'ru',
    },
    comparator: {
      0: '<=',
      1: '=',
    },
    cardClass: {
      0: 'NEUTRAL',
      1: 'DEMONHUNTER',
      2: 'DRUID',
      3: 'HUNTER',
      4: 'MAGE',
      5: 'PALADIN',
      6: 'PRIEST',
      7: 'ROGUE',
      8: 'SHAMAN',
      9: 'WARLOCK',
      10: 'WARRIOR',
    },
    type: {
      0: 'SPELL',
      1: 'MINION',
      2: 'WEAPON',
    },
  };

  const localeChoices = new Choices(inputs.locale, {
    searchEnabled: false,
    silent: true,
  });

  const comparatorChoices = new Choices(inputs.comparator, {
    searchEnabled: false,
    silent: true,
  });

  const classChoices = new Choices(inputs.cardClass, {
    searchEnabled: false,
    removeItemButton: true,
    silent: true,
  });

  const typeChoices = new Choices(inputs.type, {
    searchEnabled: false,
    removeItemButton: true,
    silent: true,
  });

  classChoices.removeActiveItems();
  typeChoices.removeActiveItems();
  inputs.submit.addEventListener('click', filterClickListener);

  function filterClickListener(evt) {
    evt.preventDefault();
    readForm();
    fetch(`json/${filterData.locale}/`)
      .then((response) => response.json())
      .then((data) => {
        applyFilters(data);
      });
  }

  function applyFilters(cards) {
    const cardsNeeded = [];

    cards.forEach((card) => {
      if (filterData.cardClass.length === 0 || filterData.cardClass.some((element) => element === card.cardClass)) {
        if (filterData.type.length === 0 || filterData.type.some((element) => element === card.type)) {
          if (filterData.comparator === '<=' && card.cost <= filterData.cost) cardsNeeded.push(card);
          if (filterData.comparator === '=' && card.cost === filterData.cost) cardsNeeded.push(card);
        }
      }
    });

    window.fillTable(cardsNeeded);
  }

  function readForm() {
    filterData.setDefault();
    filterData.locale = valuesMapping.locale[localeChoices.getValue(true)];
    filterData.comparator = valuesMapping.comparator[comparatorChoices.getValue(true)];
    if (inputs.cost.value) {
      filterData.cost = parseInt(inputs.cost.value, 10);
    } else {
      inputs.cost.value = filterData.cost;
    }

    classChoices.getValue(true).forEach((value) => {
      filterData.cardClass.push(valuesMapping.cardClass[value]);
    });

    typeChoices.getValue(true).forEach((value) => {
      filterData.type.push(valuesMapping.type[value]);
    });
  }
};
