/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import { colleges } from './dummyData';
import './table.css'


const Table = () => {
  const [filteredRows, setFilteredRows] = useState(colleges)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('rating')    // popularity | rating | highestFees | lowestFees
  const [sortDirection, setSortDirection] = useState('assec')     // assec or desc
  const [isLoading, setIsLoading] = useState(false)

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  }

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  }

  // handle sortField change
  useEffect(() => {
    setFilteredRows(oldState => {
      const sortedRows = [...oldState]
      switch (sortField) {
        case 'rating':
          return sortedRows.sort((a, b) => - (a.rating || 0) + (b.rating || 0));
        case 'popularity':
          return sortedRows.sort((a, b) => - (a.reviewsData.avgRating || 0) + (b.reviewsData.avgRating || 0));
        case 'highestFees':
          return sortedRows.sort((a, b) => {
            const totalFeesA = a.fees.reduce((accumulator, currValue) => {
              return accumulator + currValue.fee
            }, 0);
            const totalFeesB = b.fees.reduce((accumulator, currValue) => {
              return accumulator + currValue.fee
            }, 0);
            return totalFeesB - totalFeesA;
          });
        case 'lowestFees':
          return sortedRows.sort((a, b) => {
            const totalFeesA = a.fees.reduce((accumulator, currValue) => {
              return accumulator + currValue.fee
            }, 0);
            const totalFeesB = b.fees.reduce((accumulator, currValue) => {
              return accumulator + currValue.fee
            }, 0);
            return totalFeesA - totalFeesB;
          });
        default:
          return sortedRows;
      }
    })
  }, [sortField])

  // handle searchTerm change
  useEffect(() => {
    setFilteredRows((oldState) => {
      if(searchTerm === ''){
        return colleges;
      }
      return oldState.filter(college => 
        college.college_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    })
  }, [searchTerm])

  return (
    <div className="table-container">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h2>Found {filteredRows.length} Colleges</h2>
        <div style={{display: 'flex', flexGrow: 1}}>
          <div style={{ minWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
            College Name: 
            <input type='text' placeholder='Search for a college' style={{padding: '8px', borderRadius: '4px', marginLeft: '6px'}} name='collegeName' value={searchTerm} onChange={onSearchTermChange} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{fontWeight: 'bold'}}>Sort By</span>
          <div><input type='radio' name='sort' onChange={handleSortFieldChange} checked={sortField === 'popularity'} value='popularity'/>Popularity</div>
          <div><input type='radio' name='sort' onChange={handleSortFieldChange} checked={sortField === 'rating'} value='rating'/>Rating</div>
          <div><input type='radio' name='sort' onChange={handleSortFieldChange} checked={sortField === 'highestFees'} value='highestFees'/>Highest Fees</div>
          <div><input type='radio' name='sort' onChange={handleSortFieldChange} checked={sortField === 'lowestFees'} value='lowestFees'/>Lowest Fees</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>CD Rank</th>
            <th>College Name</th>
            <th>Course Fee</th>
            <th>Placement</th>
            <th>User Review</th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody >
          {filteredRows.map((row, index) => (
            <tr key={row.id} className='table-row'>
              <td>{`#${index + 1}`}</td>
              <td style={{maxWidth: '300px'}}>
                <div style={{display: 'flex'}}>
                  {/* logo here ----------------- */}
                  <img src={row.logo} alt='logo' className='college-logo'/>
                  <div style={{padding: '8px'}}>
                    <a style={{display: 'block', textDecoration: 'none', color: '#55BADE', fontSize: '1.2rem'}} href='#' target='_blank'>
                      {row.college_name}
                    </a>
                    <div style={{fontSize: '0.8rem'}}>
                      {row.college_city}, {row.state} | {row.approvals.map((approver, i) => {
                        if(i === row.approvals.length - 1){
                          return approver
                        }
                        return approver + ','
                      })} Approved
                    </div>
                  </div>
                  
                </div>
                <div style={{display: 'flex', padding: '8px', justifyContent: 'space-between'}}>
                  <a href='#' target='_blank' style={{textDecoration: 'none', color: '#FF881C'}}>Apply Now</a>
                  <a href='#' target='_blank' style={{textDecoration: 'none', color: '#3EAE8D'}}>Download Brochure</a>
                  <div>
                    <input type='radio' name='compare' value={row.id} /> Add To Compare
                  </div>
                </div>
              </td>
              <td>
                <div>
                {
                  row.fees.map((obj, i) => {
                    return (
                      <div key={i}>
                        <div style={{fontSize: '1.2rem', color: '#3EAE8D', paddingBottom: 4, fontWeight: 'bold'}}>
                          {
                            obj.fee ?
                            <span>&#8377; {obj.fee}</span>
                            : '--'
                          }
                        </div>
                        <div style={{fontSize: '0.8rem'}}>{obj.name.slice(0, obj.name.indexOf(' '))}</div>
                        <div style={{fontSize: '0.8rem'}}> - {obj.type}</div>
                      </div>
                      
                    )
                  })
                }
                </div>
              </td>
              {
                row.placement ?
                <td>
                  <div style={{fontSize: '1.2rem', color: '#3EAE8D', paddingBottom: 4, fontWeight: 'bold'}}>{row.placement.average_salary}</div>
                  <div style={{fontSize: '0.8rem'}}>Average Package</div>
                  <div style={{fontSize: '1.2rem', color: '#3EAE8D', paddingBottom: 4, fontWeight: 'bold'}}>{row.placement.highest_salary}</div>
                  <div style={{fontSize: '0.8rem'}}>Highest Package</div>
                </td>
                : <td>--</td>
              }
              {
                <td>
                  <div style={{fontSize: '1.2rem'}}><span style={{fontSize: '4rem', color: '#FF881C'}}>.</span> {row.reviewsData.avgRating} / 5</div>
                  <div>Based on {row.reviewsData.totalStudent} User Reviews</div>
                </td>
              }
              <td>--</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <div className="loading">Loading more data...</div>}
    </div>
  );
};

export default Table;

















