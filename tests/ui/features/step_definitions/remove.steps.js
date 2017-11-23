const { Given, Then, When } = require('cucumber');
const assert = require('assert');

Given(/^The contact list is display$/, function(callback) {
    this.browser.visit("http://127.0.0.1:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success, 'page loaded');
        assert.equal('Contacts', this.browser.text('h1'));

        var table = this.browser.query("table");
        var rows = this.browser.queryAll("tr:nth-child(n+2)", table);
        assert.equal(4, rows.length);

        var Contact = this.browser.tabs.current.Contact;
        var iterator = Contact.Contacts.instance().iterator();

        var data = [];

        while (iterator.hasNext())
        {
            var row = iterator.next();
            var firstName = row.firstName();
            var lastName = row.lastName();
            var phones = row.phones();
            var mobile = null;
            var phone = null;

            if (phones[0] !== null && phones[0] !== undefined) {
                mobile = phones[0].number();
            }

            if (phones[1] !== null && phones[1] !== undefined) {
                phone = phones[1].number();
            }

            var mails = row.mails();
            var proMail = null;
            var persoMail = null;

            if (mails[0] !== null && mails[0] !== undefined) {
                proMail = mails[0].address();
            }

            if (mails[1] !== null && mails[0] !== undefined) {
                persoMail = mails[1].address();
            }

            var tags = row.tags();
            var tag = null;

            if (tags[0] !== null && tags[0] !== undefined) {
                tag = tags[0];
            }

            if (mobile !== null) {
                phones = mobile + "[PRO][MOBILE]";
            }

            if (phone !== null) {
                phones += "/" + phone + "[PRO][PHONE]";
            }

            if (proMail !== null) {
                mails = proMail + "[PRO]";
            }

            if (persoMail !== null) {
                mails += "/" + persoMail + "[PERSO]";
            }

            if (proMail === null && persoMail === null) {
                mails = "";
            }

            if (tag === null) {
                tag = "";
            }


            data.push([firstName, lastName, phones, mails, tag]);
        }


        for (var i = 0; i < rows.length; i++) {
            row = rows[i];

            var found = false;

            for (var j = 0; j < data.length; j++) {
                var line = data[j];

                if (line[0] === row.children[0].innerHTML &&
                    line[1] === row.children[1].innerHTML &&
                    line[2] === row.children[2].innerHTML &&
                    line[3] === row.children[3].innerHTML &&
                    line[4] === row.children[4].innerHTML) {
                    found = true;
                    break;
                }
            }

            assert.ok(found);
        }

        callback();
    });
});

When(/^User clicks on remove button of the first contact$/, function(callback) {
    this.browser.visit("http://127.0.0.1:3000/", (err) => {
        if (err) throw err;
        assert.ok(this.browser.success, 'page loaded');
        assert.equal('Contacts', this.browser.text('h1'));

        var Contact = this.browser.tabs.current.Contact;

        var table = this.browser.query("table");
        var rows = this.browser.queryAll("tr:nth-child(n+2)", table);
        assert.equal(4, rows.length);
        assert.equal(4, Contact.Contacts.instance().size());

        var button = this.browser.query('#contacts table a:nth-child(1)');
        button.click();

        callback();
    });
});

Then(/^The first contact is removed$/, function(callback) {
    var Contact = this.browser.tabs.current.Contact;

    var table = this.browser.query("table");
    var rows = this.browser.queryAll("tr:nth-child(n+2)", table);
    assert.equal(3, Contact.Contacts.instance().size());
    assert.equal(3, rows.length);

    var iterator = Contact.Contacts.instance().iterator();
    while (iterator.hasNext()) {
        var element = iterator.next();
        assert.ok(element.firstName() !== "Eric" && element.lastName() !== "RAMAT");
    }

    for (var i = 0; i < rows.length; i++) {
        assert.ok(rows[i].children[0].innerHTML !== "Eric" && rows[i].children[1].innerHTML !== "RAMAT");
    }

    callback();
});