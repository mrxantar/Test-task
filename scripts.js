function add(product_id) {
    var warehouseIndex = "add_warehouse" + product_id;
    var quantityIndex = "add_quantity" + product_id;
    var dataToSend = {
        product_id: product_id,
        quantity: document.getElementById(quantityIndex).value,
        warehouse: document.getElementById(warehouseIndex).value,
    };

    fetch("http://127.0.0.1:5000/add",{ 
      method: "POST", 
      body: JSON.stringify(dataToSend),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    .then(response => response.json())
    .then(data => {
      var product = data[0];
      var inventory = data[1];
      var location = data[2];
      var relationIndex = "relation" + inventory[0].id;
      var locationIndex = "location" + product[0].id;
      if (document.getElementById(relationIndex))
      {
        document.getElementById(relationIndex).innerHTML = `<span id="${relationIndex}">[${location[0].name} | ${inventory[0].quantity}]</span>`
      }
      else
      {
        var newSpan = document.createElement('span');
        newSpan.id = relationIndex;
        document.getElementById(locationIndex).appendChild(newSpan);
        document.getElementById(relationIndex).innerHTML = `<span id="${relationIndex}">[${location[0].name} | ${inventory[0].quantity}]</span>`
      }
    });
  };

  function delete_entry(product_id) {
    var warehouseIndex = "delete_warehouse" + product_id;
    var quantityIndex = "delete_quantity" + product_id;
    var dataToSend = {
        product_id: product_id,
        quantity: document.getElementById(quantityIndex).value,
        warehouse: document.getElementById(warehouseIndex).value,
    };

    fetch("http://127.0.0.1:5000/delete_entry",{ 
      method: "POST", 
      body: JSON.stringify(dataToSend),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    .then(response => response.json())
    .then(data => {
      var product = data[0];
      var inventory = data[1];
      var location = data[2];
      var relationIndex = "relation" + inventory[0].id;
      var locationIndex = "location" + product[0].id;
      document.getElementById(relationIndex).innerHTML = `<span id="${relationIndex}">[${location[0].name} | ${inventory[0].quantity}]</span>`
    });
  };

  function createProduct() {
    var dataToSend = {
      productName: document.getElementById("createProductName").value,
      productDescription: document.getElementById("createProductDescription").value,
      productPrice: document.getElementById("createProductPrice").value,
    }
    
    fetch("http://127.0.0.1:5000/create_product",{ 
      method: "POST", 
      body: JSON.stringify(dataToSend),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    .then(response => response.json())
    .then(data => {
      var product = data[0];
      var locations = data[1];
      var rowIndex = "row" + product[0].id;
      var prevRowIndex = "row" + (product[0].id - 1);
      
      var newRow = document.createElement('tr');
      newRow.className = "align-middle";
      newRow.id = rowIndex;
      document.getElementById(prevRowIndex).after(newRow);
      
      let newTh = document.createElement('th');
      newTh.setAttribute('scope', 'row');
      newTh.id = `product${product[0].id}`;
      newTh.innerText = `${product[0].id}`;
      newRow.append(newTh)

      let newTdName = document.createElement('td');
      newTdName.id = `name${product[0].id}`;
      newTdName.innerText = `${product[0].name}`;
      newRow.append(newTdName);

      let newTdDescription = document.createElement('td');
      newTdDescription.id = `description${product[0].id}`;
      newTdDescription.innerText = `${product[0].description}`;
      newRow.append(newTdDescription);

      let newTdLocation = document.createElement('td');
      newTdLocation.id = `location${product[0].id}`;
      newRow.append(newTdLocation);

      let newTdPrice = document.createElement('td');
      newTdPrice.id = `price${product[0].id}`;
      newTdPrice.innerText = `${product[0].price}`;
      newRow.append(newTdPrice);

      let newTd = document.createElement('td');
      newTd.setAttribute('colspan', '3')
      let newAddInputGroup = document.createElement('div');
      newAddInputGroup.className = "input-group input-group-sm";
      newAddInputGroup.style = "width: 400px;";
      newAddInputGroup.id = "addInput";
      
      let newAddSelect = document.createElement('select');
      newAddSelect.className = 'form-select';
      newAddSelect.setAttribute('aria-label', 'Default select example');
      newAddSelect.id = `add_warehouse${product[0].id}`;
      const addOptionDefault = document.createElement('option');
      addOptionDefault.selected = true;
      addOptionDefault.text = 'Выберите склад';
      newAddSelect.add(addOptionDefault);
      for (let i = 0; i < locations.length; i++)
      {
        const option = document.createElement("option");
        option.value = locations[i].id;
        option.text = locations[i].name;
        newAddSelect.add(option);
      }
      newAddInputGroup.appendChild(newAddSelect);
      
      let newAddInput = document.createElement('input');
      newAddInput.type = 'number';
      newAddInput.className = 'form-control';
      newAddInput.setAttribute('placeholder', 'Количество');
      newAddInput.setAttribute('aria-label', 'Количество');
      newAddInput.setAttribute('aria-describedby', 'button-addon1');
      newAddInput.id = `add_quantity${product[0].id}`;
      newAddInputGroup.append(newAddInput);

      newAddButton = document.createElement('button');
      newAddButton.type = 'submit';
      newAddButton.className = 'btn btn-success';
      newAddButton.id = 'button-id1';
      newAddButton.setAttribute('name', 'add');
      newAddButton.setAttribute('onclick', `add(${product[0].id})`);
      newAddButton.innerText = 'Добавить';
      newAddInputGroup.append(newAddButton);
      newTd.appendChild(newAddInputGroup);



      let divider = document.createElement('h1');
      divider.text = ' ';
      newTd.appendChild(divider);
      


      let newDeleteInputGroup = document.createElement('div');
      newDeleteInputGroup.className = "input-group input-group-sm";
      newDeleteInputGroup.style = "width: 400px;";
      newDeleteInputGroup.id = "deleteInput";

      let newDeleteSelect = document.createElement('select');
      newDeleteSelect.className = 'form-select';
      newDeleteSelect.setAttribute('aria-label', 'Default select example');
      newDeleteSelect.id = `delete_warehouse${product[0].id}`;
      const deleteOptionDefault = document.createElement('option');
      deleteOptionDefault.selected = true;
      deleteOptionDefault.text = 'Выберите склад';
      newDeleteSelect.add(deleteOptionDefault);
      for (let i = 0; i < locations.length; i++)
      {
        const option = document.createElement("option");
        option.value = locations[i].id;
        option.text = locations[i].name;
        newDeleteSelect.add(option);
      }
      newDeleteInputGroup.appendChild(newDeleteSelect);

      let newDeleteInput = document.createElement('input');
      newDeleteInput.type = 'number';
      newDeleteInput.className = 'form-control';
      newDeleteInput.setAttribute('placeholder', 'Количество');
      newDeleteInput.setAttribute('aria-label', 'Количество');
      newDeleteInput.setAttribute('aria-describedby', 'button-addon2');
      newDeleteInput.id = `delete_quantity${product[0].id}`;
      newDeleteInputGroup.append(newDeleteInput);

      newDeleteButton = document.createElement('button');
      newDeleteButton.type = 'submit';
      newDeleteButton.className = 'btn btn-danger';
      newDeleteButton.id = 'button-id2';
      newDeleteButton.setAttribute('name', 'danger');
      newDeleteButton.setAttribute('onclick', `delete_entry(${product[0].id})`);
      newDeleteButton.innerText = 'Удалить';
      newDeleteInputGroup.append(newDeleteButton);
      newTd.appendChild(newDeleteInputGroup);

      newRow.appendChild(newTd);
    });
  }

  function createLocation() {
    var dataToSend = {
      locationName: document.getElementById('createLocationName').value
    }
    fetch("http://127.0.0.1:5000/create_location",{ 
      method: "POST", 
      body: JSON.stringify(dataToSend),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    .then(response => response.json())
    .then(data => {
      var locations = data[0];
      var selectorsList = document.querySelectorAll("select.form-select")
      selectorsList.forEach(function (selector) {
        const option = document.createElement("option");
        option.value = locations.id;
        option.text = locations.name;
        selector.add(option);
      });
    })
  }