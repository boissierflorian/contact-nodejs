const { Given, Then, When } = require('cucumber');
const assert = require('assert');

Given(/^The contact list is displayed$/, function(callback) {
    this.browser.visit("http://127.0.0.1:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success, 'page loaded');
        assert.equal('Contacts', this.browser.text('h1'));

        var table = this.browser.query("table");
        var rows = this.browser.queryAll("tr:nth-child(n+2)", table);
        assert.equal(4, rows.length);

        var Contact = this.browser.tabs.current.Contact;
        assert.equal(4, Contact.Contacts.instance().size());

        callback();
    });
});

When(/^User clicks on the sort button$/, function(callback) {
    this.browser.visit("http://127.0.0.1:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success, 'page loaded');
        assert.equal('Contacts', this.browser.text('h1'));

        this.browser.query("#button_sort").click();

        callback();
    });
});

Then(/^The contact list is sorted by last name$/, function(callback) {
    var Contact = this.browser.tabs.current.Contact;
    var it = Contact.Contacts.instance().iterator();
    var lastNames = [];

    while (it.hasNext()) {
        lastNames.push(iter.next().lastName());
    }

    lastNames.sort(function(a, b){ return a > b; });

    var table = this.browser.query("table");
    var rows = this.browser.queryAll("tr:nth-child(n+2)", table);

    for (var index = 0; index < rows.length; index++) {
        assert.equal(lastNames[index], rows[index].children[1].innerHTML);
    }

    callback();
});