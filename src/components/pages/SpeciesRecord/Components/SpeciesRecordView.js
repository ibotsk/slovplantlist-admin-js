import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Col, Row, Well,
  ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import PropTypes from 'prop-types';
import SynonymType from 'components/propTypes/synonym';

import LosName from 'components/segments/Checklist/LosName';
import SynonymListItem from 'components/segments/SynonymListItem';

import { speciesFacade } from 'facades';

import config from 'config/config';

const CHECKLIST_LIST_URI = '/checklist';

const MisidentificationAuthor = ({ item }) => (
  <div className="checklist-subinfo">
    Misidentified by:
    {' '}
    {
      `${item.misidentificationAuthor || '-'}`
    }
  </div>
);

class SpeciesRecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      record: undefined,
      accepted: undefined,
      basionym: undefined,
      replaced: undefined,
      nomenNovum: undefined,
      genus: undefined,
      familyApg: undefined,
      family: undefined,
      nomenclatoricSynonyms: [],
      taxonomicSynonyms: [],
      invalidDesignations: [],
      misidentifications: [],
      basionymFor: [],
      replacedFor: [],
      nomenNovumFor: [],
    };
  }

  async componentDidMount() {
    const { recordId, accessToken } = this.props;
    if (recordId) {
      const {
        speciesRecord, accepted, basionym, replaced, nomenNovum,
        genus, familyApg, family,
      } = await speciesFacade.getRecordById(recordId, accessToken);

      const {
        nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations,
        misidentifications,
      } = await speciesFacade.getSynonyms(recordId, accessToken);
      const {
        basionymFor, replacedFor, nomenNovumFor,
      } = await speciesFacade.getBasionymsFor(recordId, accessToken);

      this.setState({
        record: speciesRecord,
        accepted,
        basionym,
        replaced,
        nomenNovum,
        genus,
        familyApg,
        family,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        misidentifications,
        basionymFor,
        replacedFor,
        nomenNovumFor,
      });
    }
  }

  renderSynonyms = (list, prefix, Addition = undefined) => {
    if (list && list.length) {
      return list.map((s) => {
        let adt;
        if (Addition) {
          // used for misidentification authors
          adt = () => (<Addition item={s} />);
        }
        return (
          <SynonymListItem
            data={s}
            prefix={prefix}
            key={s.id}
            additions={adt}
          />
        );
      });
    }
    return <ListGroupItem />;
  }

  renderPlainListOfSpeciesNames = (list) => {
    if (list && list.length) {
      return list.map((b) => (
        <ListGroupItem key={b.id}>
          <LosName data={b} />
        </ListGroupItem>
      ));
    }
    return <ListGroupItem />;
  }

  render() {
    const {
      familyApg, family, genus,
      accepted, basionym, replaced, nomenNovum,
      nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations,
      misidentifications,
      basionymFor, replacedFor, nomenNovumFor,
      record,
    } = this.state;
    if (!record) {
      return null;
    }
    const {
      ntype, publication, vernacular, tribus,
    } = record;
    const type = config.mappings.losType[ntype];
    return (
      <div id="species-detail">
        <Grid id="functions-panel">
          <div id="functions">
            <Row>
              <Col sm={5} smOffset={2}>
                <LinkContainer to={CHECKLIST_LIST_URI}>
                  <Button bsStyle="default">Back</Button>
                </LinkContainer>
              </Col>
            </Row>
          </div>
        </Grid>
        <hr />
        <Grid>
          <h2><LosName data={record} /></h2>
          <div id="name">
            <h3>Name</h3>
            <Well>
              <dl className="dl-horizontal">
                <dt>Family APG</dt>
                <dd>{familyApg || '-'}</dd>
                <dt>Family</dt>
                <dd>{family || '-'}</dd>
                <dt>Genus (reference)</dt>
                <dd>{genus ? genus[0].label : '-'}</dd>
              </dl>
            </Well>
            <Well>
              <dl className="dl-horizontal">
                <dt>Type</dt>
                <dd>{type.text || ''}</dd>
                <dt>Species</dt>
                <dd><LosName data={record} /></dd>
              </dl>
            </Well>
            <Well>
              <dl className="dl-horizontal">
                <dt>Publication</dt>
                <dd>{publication || '-'}</dd>
                <dt>Vernacular</dt>
                <dd>{vernacular || '-'}</dd>
                <dt>Tribus</dt>
                <dd>{tribus || '-'}</dd>
              </dl>
            </Well>
          </div>
          <div id="associations">
            <h3>Associations</h3>
            <Well>
              <dl className="dl-horizontal">
                <dt>Accepted name</dt>
                <dd>{accepted ? accepted[0].label : '-'}</dd>
                <dt>Basionym</dt>
                <dd>{basionym ? basionym[0].label : '-'}</dd>
                <dt>Replaced name</dt>
                <dd>{replaced ? replaced[0].label : '-'}</dd>
                <dt>Nomen novum</dt>
                <dd>{nomenNovum ? nomenNovum[0].label : '-'}</dd>
              </dl>
            </Well>
          </div>
          <div id="synonyms">
            <h3>Synonyms</h3>
            <Well>
              <dl className="dl-horizontal">
                <dt>Nomenclatoric Synonyms</dt>
                <dd>
                  <ListGroup>
                    {this.renderSynonyms(
                      nomenclatoricSynonyms,
                      config.mappings.synonym.nomenclatoric.prefix,
                    )}
                  </ListGroup>
                </dd>
                <dt>Taxonomic Synonyms</dt>
                <dd>
                  <ListGroup>
                    {this.renderSynonyms(
                      taxonomicSynonyms,
                      config.mappings.synonym.taxonomic.prefix,
                    )}
                  </ListGroup>
                </dd>
                <dt>Invalid Designations</dt>
                <dd>
                  <ListGroup>
                    {this.renderSynonyms(
                      invalidDesignations,
                      config.mappings.synonym.invalid.prefix,
                    )}
                  </ListGroup>
                </dd>
                <dt>Misidentifications</dt>
                <dd>
                  <ListGroup>
                    {this.renderSynonyms(
                      misidentifications,
                      config.mappings.synonym.misidentification.prefix,
                      MisidentificationAuthor,
                    )}
                  </ListGroup>
                </dd>
              </dl>
            </Well>
          </div>
          <div id="associations-inherited">
            <h3>Inherited associations</h3>
            <Well>
              <dl className="dl-horizontal">
                <dt>Basionym For</dt>
                <dd>
                  <ListGroup>
                    {this.renderPlainListOfSpeciesNames(basionymFor)}
                  </ListGroup>
                </dd>
                <dt>Replaced For</dt>
                <dd>
                  <ListGroup>
                    {this.renderPlainListOfSpeciesNames(replacedFor)}
                  </ListGroup>
                </dd>
                <dt>Nomen Novum For</dt>
                <dd>
                  <ListGroup>
                    {this.renderPlainListOfSpeciesNames(nomenNovumFor)}
                  </ListGroup>
                </dd>
              </dl>
            </Well>
          </div>

          <div id="controls">
            <Row>
              <Col sm={5} smOffset={2}>
                <LinkContainer to={CHECKLIST_LIST_URI}>
                  <Button bsStyle="default">Back</Button>
                </LinkContainer>
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(SpeciesRecordView);

SpeciesRecordView.propTypes = {
  accessToken: PropTypes.string.isRequired,
  recordId: PropTypes.string,
};

SpeciesRecordView.defaultProps = {
  recordId: undefined,
};

MisidentificationAuthor.propTypes = {
  item: SynonymType.type.isRequired,
};
