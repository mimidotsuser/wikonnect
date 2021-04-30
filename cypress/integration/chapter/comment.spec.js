function parentComment() {
    return cy.comments({parentId: false}).then((comments) => {
        return comments
            .filter((comment) => comment.chapterId !== undefined)[0]
    });
}

describe('Chapter comments when authenticated', () => {

    beforeEach(() => {
        cy.login();
        parentComment()
            .then((comment) => {
                cy.visit(`/chapter/${comment.chapterId}`)
            });
    });


    it('should display comment form', () => {
        cy.get('#chapter .padded form')
            .should('exist');

        cy.get('#chapter .padded form textarea')
            .should('be.visible');

        cy.get('#chapter .padded form button[type="submit"]')
            .should('be.visible');
    });

    it('should notify on comment posting success', () => {
        const comment = {text: `Test notification randomly at ${Math.random() * 1000000}`};

        cy.get('#chapter .padded form textarea')
            .type(comment.text);

        cy.get('#chapter .padded form button[type="submit"]')
            .click();

        cy.get('.ember-notify.ember-notify-show.success .message')
            .should('be.visible')


    });

    it('should notify on comment posting error', () => {
        const comment = {text: `What the hell randomly at ${Math.random() * 1000000}`};

        cy.get('#chapter .padded form textarea')
            .type(comment.text);

        cy.get('#chapter .padded form button[type="submit"]')
            .click();

        cy.get('.ember-notify.ember-notify-show.alert .message')
            .should('be.visible');
    });

    it('should display comments', () => {
        cy.get('div#comments-section .media-body')
            .should('exist');
    });

    it('should be able to reply to a comment', () => {
        const reply = `Test reply randomly at ${Math.random() * 1000000}`;

        cy.get('#chapter .padded form textarea').type('Memento Mori');
        cy.get('#chapter .padded form button[type="submit"]').click();

        cy.get('#comments-section > :nth-child(1) > .media-body > .reply-actions > :nth-child(2) > button')
            .click();

        cy.get('.reply-form textarea').should('be.visible');

        cy.get('.reply-form textarea').type(reply);
        cy.get('.reply-form button[type=submit]').click();

        cy.get(
            "#comments-section > :nth-child(1) > .media-body > .media > .replies"
        )
            .contains(reply)
            .should('be.visible');
    });

})


describe('Chapter comments without authentication', () => {

    beforeEach(() => {
        parentComment()
            .then((comment) => {
                cy.visit(`/chapter/${comment.chapterId}`)
            });
    });

    it('should not display comment form', () => {
        cy.get('#chapter .padded form')
            .should('not.exist');
    });

    it('should display available comments', () => {
        cy.get('#chapter #comments-section')
            .should('exist')
    });
})