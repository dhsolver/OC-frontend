import { defaultTestUserEmail } from './data';
import { randomEmail } from './faker';

/**
 * Login with an exising account. If not provided in `params`, the email used for
 * authentication will be `defaultTestUserEmail`.
 *
 * @param {object} params:
 *    - redirect: The redirect URL
 *    - email: User email
 */
Cypress.Commands.add('login', (params = {}) => {
  const { email = defaultTestUserEmail, redirect = null } = params;
  const user = { email, newsletterOptIn: false };

  return signinRequest(user, redirect).then(({ body: { redirect } }) => {
    // Test users are allowed to signin directly with E2E, thus a signin URL
    // is directly returned by the API. See signin function in
    // opencollective-api/server/controllers/users.js for more info
    return cy.visit(redirect).then(() => user);
  });
});

/**
 * Create a new account an SignIn. If no email is provided in `params`, the account
 * will be generated using a random email.
 */
Cypress.Commands.add('signup', ({ user = {}, redirect = '/', visitParams }) => {
  if (!user.email) {
    user.email = randomEmail();
  }

  return signinRequest(user, redirect).then(({ body: { redirect } }) => {
    // Test users are allowed to signin directly with E2E, thus a signin URL
    // is directly returned by the API. See signin function in
    // opencollective-api/server/controllers/users.js for more info
    return cy.visit(redirect, visitParams).then(() => user);
  });
});

/**
 * Create a collective. Admin will be the user designated by `email`. If not
 * provided, the email used will default to `defaultTestUserEmail`.
 */
Cypress.Commands.add('createCollective', ({ type = 'ORGANIZATION', email = defaultTestUserEmail }) => {
  const user = { email, newsletterOptIn: false };
  return signinRequest(user, null).then(response => {
    const token = getTokenFromRedirectUrl(response.body.redirect);
    return graphqlQuery(token, {
      operationName: 'createCollective',
      query: `
          mutation createCollective($collective: CollectiveInputType!) {
            createCollective(collective: $collective) {
              id
              slug
            }
          }
        `,
      variables: { collective: { location: {}, name: 'TestOrg', slug: '', tiers: [], type } },
    }).then(({ body }) => {
      return body.data.createCollective;
    });
  });
});

/**
 * Add a stripe credit card on the collective designated by `collectiveSlug`.
 */
Cypress.Commands.add('addCreditCardToCollective', ({ collectiveSlug }) => {
  cy.login({ redirect: `/${collectiveSlug}/edit/payment-methods` });
  cy.get('.editPaymentMethodsActions button').click();
  cy.wait(2000);
  cy.get('.__PrivateStripeElement iframe').then(iframe => {
    const body = iframe.contents().find('body');

    cy.wrap(body)
      .find('input:eq(1)')
      .type('4242424242424242');

    cy.wrap(body)
      .find('input:eq(2)')
      .type('1222');

    cy.wrap(body)
      .find('input:eq(3)')
      .type('123');

    cy.wrap(body)
      .find('input:eq(4)')
      .type('42222');

    cy.wait(1000);

    cy.get('button[type="submit"]').click();

    cy.wait(2000);
  });
});

/**
 * Fill a stripe creditcard input.
 *
 * @param container {DOM|null} pass it if you have multiple stripe inputs on the page
 * @param {object} cardParams the credit card info. Defaults to a valid card
 *    - creditCardNumber
 *    - expirationDate
 *    - cvcCode
 *    - postalCode
 */
Cypress.Commands.add(
  'fillStripeInput',
  (
    container,
    cardParams = {
      creditCardNumber: '4242424242424242',
      expirationDate: '1250',
      cvcCode: '123',
      postalCode: '42222',
    },
  ) => {
    const stripeIframeSelector = '.__PrivateStripeElement iframe';
    const iframePromise = container ? container.find(stripeIframeSelector) : cy.get(stripeIframeSelector);

    return iframePromise.then(iframe => {
      const { creditCardNumber, expirationDate, cvcCode, postalCode } = cardParams;
      const body = iframe.contents().find('body');
      const fillInput = (index, value) => {
        if (value === undefined) {
          return;
        }

        return cy
          .wrap(body)
          .find(`input:eq(${index})`)
          .type(`{selectall}${value}`);
      };

      fillInput(1, creditCardNumber);
      fillInput(2, expirationDate);
      fillInput(3, cvcCode);
      fillInput(4, postalCode);
    });
  },
);

/**
 * A helper for the `StepsProgress` component to check that the steps in params
 * are enabled or disabled. `enabled` and `disabled` can both be passed an array
 * of strings or a single string.
 */
Cypress.Commands.add('checkStepsProgress', ({ enabled = [], disabled = [] }) => {
  const isEnabled = step => cy.get(`.step-${step}`).should('not.have.class', 'disabled');
  const isDisabled = step => cy.get(`.step-${step}`).should('have.class', 'disabled');

  Array.isArray(enabled) ? enabled.forEach(isEnabled) : isEnabled(enabled);
  Array.isArray(disabled) ? disabled.forEach(isDisabled) : isDisabled(disabled);
});

/**
 * A helper to fill input fields generated by the `InputField` component.
 */
Cypress.Commands.add('fillInputField', (fieldname, value) => {
  return cy.get(`.inputField.${fieldname} input`).type(value);
});

// ---- Private ----

function signinRequest(user, redirect) {
  return cy.request({
    url: '/api/users/signin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, redirect }),
  });
}

function getTokenFromRedirectUrl(url) {
  const regex = /\/signin\/([^?]+)/;
  return regex.exec(url)[1];
}

function graphqlQuery(token, body) {
  return cy.request({
    url: '/api/graphql',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
