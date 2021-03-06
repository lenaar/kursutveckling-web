import React from 'react'
import { Table } from 'reactstrap'
import CoursePlansCollapsibleList from './CoursePlansCollapsibleList'
import { KURSINFO_ADMIN_URL, COURSE_INFO_URL } from '../util/constants'

const KipLinkNav = ({courseCode, translate, lang}) => { // courseCode, lang, startCards
  const kursOmLink = `${COURSE_INFO_URL}${courseCode}?l=${lang}`
  const kursAdmin = `${KURSINFO_ADMIN_URL}${courseCode}?l=${lang}`
  return (
    <span className='navigation row'>
      <Table className='kip-menu'>
        <tbody>
          <tr>
            <td colSpan='2'>
              <h4>{translate.about_course}</h4>
              <p>
                <a href={kursOmLink} alt={translate.course_info_title_alt}>{translate.course_info_title}</a>
              </p>
              <p>
                <b>{translate.course_dev_title}</b>
              </p>
            </td>
            <td className='admin-link'>
              <p>
                <a href={kursAdmin} className='link-to' alt={translate.course_admin_title_alt}>{translate.course_admin_title}</a>
              </p>
            </td>
          </tr>
        </tbody>
      </Table>
      <span className='right_intro col'>
        <CoursePlansCollapsibleList translate={translate} lang={lang} />
      </span>
    </span>
    )
}

export default KipLinkNav
