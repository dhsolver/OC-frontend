import React from 'react';
import {
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Row,
} from 'react-bootstrap';
import Router from 'next/router';
import classNames from 'classnames';

import withData from '../lib/withData'
import withIntl from '../lib/withIntl';
import { addSearchQueryData } from '../graphql/queries';

import Body from '../components/Body';
import Button from '../components/Button';
import CollectiveCard from '../components/CollectiveCard';
import ErrorPage from '../components/ErrorPage';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingGrid from '../components/LoadingGrid';
import { Link } from '../server/pages';

import colors from '../constants/colors';

class SearchPage extends React.Component {
  static getInitialProps({ query = {} }) {
    return {
      limit: query.limit || 20,
      offset: query.offset || 0,
      term: query.q,
    };
  }

  refetch = (event) => {
    event.preventDefault();

    const { target: form } = event;
    const { url } = this.props;
    const { q } = form;

    Router.push({ pathname: url.pathname, query: { q: q.value } });
  }

  render() {
    const { data: { error, loading, search }, term } = this.props;

    const {
      collectives,
      limit,
      offset,
      total,
    } = search || {};

    if (error) {
      return <ErrorPage {...error} />;
    }

    return (
      <div>
        <style jsx>{`
          div :global(.results-row) {
            flex-wrap: wrap;
            justify-content: flex-start;
            margin: 0;
          }

          @media(max-width: 500px) {
            div :global(.results-row) {
              justify-content: center;
            }
          }

          div :global(.search-row) {
            align-items: end;
            display: flex;
            margin: 0;
          }

          div :global(.col) {
            display: flex;
            flex-grow: 1;
            justify-content: flex-start;
            margin: 2rem 1rem;
            max-width: 200px;
          }

          div :global(input[type=search]) {
            border: none;
            border-bottom: 2px solid ${colors.blue};
            border-radius: 0;
            box-shadow: none;
            display: block;
            font-family: lato;
            padding: 0;
          }

          .loading {
            padding: 2rem 0;
            text-align: center;
            width: 100%;
          }

          .pagination {
            margin: 2rem auto;
          }
        `}</style>
        <Header />
        <Body>
          <Grid>
            <Row>
              <Col xs={12}>
                <form method="GET" onSubmit={this.refetch}>
                  <FormGroup controlId="search" bsSize="large">
                    <ControlLabel className="h1">Search Open Collective</ControlLabel>
                    <div className="search-row">
                      <FormControl type="search" name="q" placeholder="Hoodie" className="search-input" defaultValue={term} />
                      <Button type="submit" className="blue" style={{ padding: '0 2rem' }}><span className="fa fa-search"/></Button>
                    </div>
                  </FormGroup>
                </form>
              </Col>
            </Row>
            <Row className="results-row">
              { loading && (
                <div className="loading">
                  <LoadingGrid /> 
                </div>
              )}
              { /* TODO: add suggested collectives when the result is empty */ } 
              {!!collectives && !loading && collectives.map(collective => (
                <Col className="col" key={collective.slug}>
                  <CollectiveCard collective={collective} />
                </Col>
              ))}
            </Row>
            <Row>
              <ul className="pagination">
                { Array(Math.ceil(total / limit)).fill(1).map((n, i) => (
                  <li className={classNames({ active: (i * limit) === offset })}>
                    <Link
                      href={{
                        query: {
                          limit,
                          offset: i * limit,
                          q: term,
                        }
                      }}
                      key={i * limit}
                    >
                      {`${n + i}`}
                    </Link>
                  </li>
                )) }
              </ul>
            </Row>
          </Grid>
        </Body>
        <Footer />
      </div>
    )
  }
}

export default withData(addSearchQueryData(withIntl(SearchPage)));
