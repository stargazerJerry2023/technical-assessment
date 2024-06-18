import React from 'react'
import { useState, useEffect } from 'react'
import './Table.css'
import Table from 'react-bootstrap/Table'   
import axios from 'axios';
import Filter from '../Filter/Filter'
import Community from '../Community/Community'


export const Table_main = ({ apiEndpoint }) => {
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateValue, setStateValue] = useState('');
  const [lccnValue, setLccnValue] = useState('');
  const [communityMembers, setCommunityMembers] = useState([]);

  const handleCommunitySubmit = async (member) => {
    setCommunityMembers([...communityMembers, member]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://cors-anywhere.herokuapp.com/${apiEndpoint}`);
        console.log(response.data); 
        setData(response.data.newspapers); 
        setFilteredData(response.data.newspapers);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/members');
        setCommunityMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError(error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    console.log(`State Filter: ${stateValue}, LCCN Filter: ${lccnValue}`); 

    let filtered = data;

    if (stateValue) {
      filtered = filtered.filter(item => item.state.toLowerCase().includes(stateValue.toLowerCase()));
    }

    if (lccnValue) {
      filtered = filtered.filter(item => item.lccn.toLowerCase().startsWith(lccnValue.toLowerCase()));
    }

    console.log('Filtered Data:', filtered); 
    setFilteredData(filtered);
  }, [stateValue, lccnValue, data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  const handleRowClick = (url) => {
    window.open(url, '_blank');
  };

  const resultMessage = filteredData.length > 0 ? 
    `There are a total of ${filteredData.length} results found` : 
    'There were no results found';

  return (
    <div className="table-border-container">
      <Filter
        stateValue={stateValue}
        setStateValue={setStateValue}
        lccnValue={lccnValue}
        setLccnValue={setLccnValue}
      />
      <div className="table-wrapper">
        <Table responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>State</th>
              <th>LCCN</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(`https://chroniclingamerica.loc.gov/lccn/${item.lccn}`)} style={{ cursor: 'pointer' }}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.state}</td>
                <td>{item.lccn}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="table-row-count">{resultMessage}</p>
      <Community onSubmit={handleCommunitySubmit} />
      <div className="community-list">
        <h3>Community Members</h3>
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {communityMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{new Date(member.joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

        
    
  
  export default Table_main;