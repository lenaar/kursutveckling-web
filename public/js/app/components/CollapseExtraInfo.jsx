import React, { Component } from 'react'
import { Collapse } from 'reactstrap'
import { formatISODate } from '../util/helpers'

const ExtraKoppsInfo = ({ translate, courseRoundObj }) => {
  const popOverId = courseRoundObj._id
  const orderedColumns = ['commentExam', 'programmeCodes', 'analysisName']
  return (
    <span className='extra-kopps-info-from-kutv-api'>
      {
        orderedColumns.map((apiName, index) =>
          <span key={index} className={apiName}>
            <p id={popOverId + index} key={'header-for-' + apiName}><b>{translate[apiName].header}</b></p>
            {courseRoundObj[apiName] === ''
              ? <p className='textBlock'> <i>{translate.no_added}</i></p>
              : <p className='textBlock' dangerouslySetInnerHTML={{ __html: courseRoundObj[apiName] }} />}
          </span>
        )
      }
    </span>
  )
}
const ExtraDatesAndComment = ({ translate, courseRoundObj }) => {
  return (
    <span>
      <p><b>{translate.header_publishing_dates}</b></p>
      <p>{translate.publishedDate}:&nbsp;
        {formatISODate(courseRoundObj.publishedDate, translate.page_lang)}
      </p>
      {courseRoundObj.changedAfterPublishedDate && courseRoundObj.changedAfterPublishedDate !== ''
        ? <span>
          <p>{translate.changedAfterPublishedDate}:&nbsp;
            {formatISODate(courseRoundObj.changedAfterPublishedDate, translate.page_lang)}
          </p>
          <p>{translate.commentChange}:</p>
          <p>{courseRoundObj.commentChange === ''
            ? <i>{translate.no_added}</i>
            : courseRoundObj.commentChange}
          </p>
          </span>
        : <p>{translate.changedAfterPublishedDate}:&nbsp;<i>{translate.no_date_last_changed}</i></p>}
    </span>
  )
}
class CollapseExtraInfo extends Component {
  constructor (props) {
    super(props)
    this.toggleHeader = this.toggleHeader.bind(this)
    this.state = { collapseExtraInfo: this.props.isOpen }
  }

  toggleHeader (event) {
    event.preventDefault()
    this.setState(state => ({ collapseExtraInfo: !state.collapseExtraInfo }))
  }

  render () {
    const { courseRoundObj, label, translate } = this.props
    return (
      <div className='card collapsible rubric-list white'>
        <div className='card-header info-rubric' role='tab' onClick={this.toggleHeader}>
          <h4 className='mb-0'>
            <a
href='#more' className='collapse-header title' id={label}
              aria-expanded={this.state.collapseExtraInfo} load='false' data-toggle='collapse'
              alt={`${translate.alt_header_more_info} ${courseRoundObj.analysisName}`}
            >{translate.header_more_info}
            </a>
          </h4>
        </div>
        <Collapse color='white' isOpen={this.state.collapseExtraInfo} toggler={label}>
          <div className='card-body col extra-info'>
            <ExtraKoppsInfo translate={translate.extra_kopps_info} courseRoundObj={courseRoundObj} />
            <ExtraDatesAndComment translate={translate.extra_dates_and_comments} courseRoundObj={courseRoundObj} />
          </div>
        </Collapse>
      </div>
    )
  }
}

export default CollapseExtraInfo
