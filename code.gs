function promotions_list(){
  list('category','promotions');
}

function social_list(){
  list('category','social');
}

function updates_list(){
  list('category','updates');
}

function custom_list(){
  // Display a dialog box with a title, message, input field, and "Yes" and "No" buttons. The
  // user can also close the dialog by clicking the close button in its title bar.
  var ui = SpreadsheetApp.getUi();
  var class = '';
  var keyword = '';
  var response = ui.prompt('Custom search (1/2)', 'Classifier (category, label, subject, sent...)', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) {
    class = response.getResponseText();
    response = ui.prompt('Custom search (2/2)', 'Keyword search (promotions, unread, newsletter...)', ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) {
      keyword = response.getResponseText();
      list(class,keyword);
    }
  }
}

function list(class,keyword) {
  var inbox_threads = GmailApp.search(class+':'+keyword);

  var sender_array = new Array();
  var count_array = new Array();

  for (var i = 0; i < inbox_threads.length; i++) {
    var message = inbox_threads[i].getMessages();
    for (var x = 0; x < message.length; x++) {
      var sender = message[x].getFrom();
      if(sender_array.indexOf(sender) == -1){
        sender_array.push(sender);
        count_array.push(1);
      }
      else{
        ++count_array[sender_array.indexOf(sender)];
      }
    }
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = spreadsheet.getSheetByName(class+': '+keyword);
  if (sheet == null)  spreadsheet.insertSheet(class+': '+keyword);       
  sheet = spreadsheet.getSheetByName(class+': '+keyword);
  sheet.clear();
  sheet.appendRow(['sender']);
  sheet.getRange(1, 2).setValue(['count']);
  var row = sheet.getLastRow() + 1;
  for (var y = 0; y < sender_array.length; y++) {
    sheet.getRange(row, 1).setValue(sender_array[y]);
    sheet.getRange(row, 2).setValue(count_array[y]);
    row++;
  }
  
  var range = sheet.getRange("B1:B1000");
  var rule = SpreadsheetApp.newConditionalFormatRule()
  .setGradientMaxpoint('red')
  .setGradientMinpoint('white')
  .setRanges([range])
  .build();
  var rules = sheet.getConditionalFormatRules();
  rules.pop();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}
