export default () => {
  const listingTable = document.querySelector('.js-table');
  const tableHeaders = listingTable.querySelectorAll('thead th');
  const tableSortDirectionAnchors = listingTable.querySelectorAll('thead th > span');
  const colorMapping = {
    LEGENDARY: '#f07000',
    EPIC: '#ab48ee',
    RARE: '#198eff',
    COMMON: '#0faf03',
    FREE: '#000000',
  };
  const errorCard = {
    name: 'Error',
    text: '<b>Battlecry:</b> <b>Freeze</b> all characters.',
    cost: 10,
    attack: 10,
    health: 10,
    rarity: 'LEGENDARY',
    id: 'ERR_OR',
  };

  tableHeaders.forEach((th, index) => {
    let dir = 1;
    th.addEventListener('click', () => {
      const direction = dir ? 'desc' : 'asc';
      resetSortedInTableHeader();
      sortTable(listingTable, index, (dir = 1 - dir));
      th.querySelector('span').setAttribute('data-sorted', direction);
    });
  });

  function resetSortedInTableHeader() {
    tableSortDirectionAnchors.forEach((anchor) => {
      anchor.removeAttribute('data-sorted');
    });
  }

  function sortTable(table, col, reverse) {
    const tb = table.tBodies[0];
    const reverseDirection = -((+reverse) || -1);
    const tr = Array.from(tb.rows);

    tr.sort((a, b) => {
      if (a.cells[col].textContent.trim().match(/^\d+$/)) {
        return reverseDirection * (a.cells[col].textContent.trim().localeCompare(b.cells[col].textContent.trim(), undefined, { numeric: true }));
      }
      return reverseDirection * (a.cells[col].textContent.trim().localeCompare(b.cells[col].textContent.trim()));
    });
    tr.forEach((element) => {
      tb.appendChild(element);
    });
  }

  function addRow(card) {
    let cardHealth;
    const cardText = card.text ? `<span>${card.text}</span>` : '';
    const cardAttack = card.attack ? `<span>${card.attack}</span>` : '<span style="display: none;">0</span>';

    if (card.health) {
      cardHealth = `<span>${card.health}</span>`;
    } else if (card.durability) {
      cardHealth = `<span style="background-color: #9f9f9f;">${card.durability}</span>`;
    } else {
      cardHealth = '<span style="display: none;">0</span>';
    }

    // default
    // <a style="color: ${colorMapping[card.rarity]};">${card.name}</a>

    // to array
    // <a style="color: ${colorMapping[card.rarity]};">'${card.id}', // ${card.name}</a>

    const html = `
    <tr>
        <td class="listing-body__cell-descr">
            <a style="color: ${colorMapping[card.rarity]};">${card.name}</a>
            ${cardText}
        </td>
        <td class="listing-body__cell-cost">
            <span>${card.cost}</span>
        </td>
        <td class="listing-body__cell-atk">
            ${cardAttack}
        </td>
        <td class="listing-body__cell-hp">
            ${cardHealth}
        </td>
    </tr>
    `;

    listingTable.tBodies[0].insertAdjacentHTML('beforeend', html);
  }

  function fillTable(cards) {
    listingTable.tBodies[0].innerHTML = '';
    if (cards.length === 0) {
      addRow(errorCard);
    } else {
      cards.forEach((card) => {
        addRow(card);
      });
    }

    resetSortedInTableHeader();
  }

  window.fillTable = fillTable;
};
