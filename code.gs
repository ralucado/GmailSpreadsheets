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
  var ui = SpreadsheetApp.getUi();
  var category = '';  // renamed from class
  var keyword = '';
  var response = ui.prompt('Custom search (1/2)', 'Classifier (category, label, subject, sent...)', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) {
    category = response.getResponseText();
    response = ui.prompt('Custom search (2/2)', 'Keyword search (promotions, unread, newsletter...)', ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) {
      keyword = response.getResponseText();
      list(category, keyword);
    }
  }
}

function list(category, keyword) {
  var inbox_threads = GmailApp.search(category+':'+keyword);

  var sender_array = [];
  var count_array = [];

  for (var i = 0; i < inbox_threads.length; i++) {
    var message = inbox_threads[i].getMessages();
    for (var x = 0; x < message.length; x++) {
      var sender = message[x].getFrom();
      var senderIndex = sender_array.indexOf(sender);
      if(senderIndex == -1){
        sender_array.push(sender);
        count_array.push(1);
      }
      else{
        ++count_array[senderIndex];
      }
    }
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var sheetName = category+': '+keyword;
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet == null)  spreadsheet.insertSheet(sheetName);
  sheet = spreadsheet.getSheetByName(sheetName);
  sheet.clear();
  sheet.appendRow(['sender']);
  sheet.getRange(1, 2).setValue('count');
  var row = 2;
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
