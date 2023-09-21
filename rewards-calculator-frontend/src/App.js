import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
// import transactions_data from './data.js';
// Show transaction data in table format for user
const user_data = [
  {
    "userID": 1,
    "customerName": "John Doe"
  },
  {
    "userID": 2,
    "customerName": "Jane Smith"
  },
  {
    "userID": 3,
    "customerName": "Dale Jones"
  }
]

const transaction_data = [
  {
    "userID": 1,
    "trans_ID": 1,
    "amount": 120.0,
    "transactionDate": "2023-09-05"
  },
  {
    "userID": 2,
    "trans_ID": 2,
    "amount": 75.0,
    "transactionDate": "2023-09-10"
  },
  {
    "userID": 1,
    "trans_ID": 3,
    "amount": 50.0,
    "transactionDate": "2023-09-15"
  },
  {
    "userID": 2,
    "trans_ID": 4,
    "amount": 200.0,
    "transactionDate": "2023-09-20"
  },
  {
    "userID": 1,
    "trans_ID": 5,
    "amount": 80.0,
    "transactionDate": "2023-10-05"
  },
  {
    "userID": 3,
    "trans_ID": 6,
    "amount": 50.0,
    "transactionDate": "2023-09-15"
  },
  {
    "userID": 3,
    "trans_ID": 7,
    "amount": 200.0,
    "transactionDate": "2023-09-20"
  },
  {
    "userID": 3,
    "trans_ID": 8,
    "amount": 80.0,
    "transactionDate": "2023-10-05"
  }
]




function App() {
  const [userTransactions, setUserTransactions] = useState(
    Array(user_data.length).fill(false)
  );

  const [userRewards, setUserRewards] = useState(
    Array(user_data.length).fill(false)
  );

  const [userRewardsD, setUserRewardsD] = useState(
    Array(user_data.length).fill(null)
  );

  const setUserRewardsDD = (index, data) => {
    const nextUserRewardsD = userRewardsD;
    nextUserRewardsD[index] = data;
    setUserRewardsD(nextUserRewardsD);
  }

  const showUserRewards = (index) => {
    const nextUserRewards = [...userRewards];
    nextUserRewards[index] = !userRewards[index];
    setUserRewards(nextUserRewards);
  }

  const userTransactionsData = (userID) => {
    console.log("getUserTransactions", userID);
    const userTransactionsData = transaction_data.filter((transaction) => transaction.userID === userID);
    userTransactionsData.sort((a, b) => (a.transactionDate > b.transactionDate) ? 1 : -1);
    return userTransactionsData;
  }

  const showUserTransactions = (index) => {
    const nextUserTransactions = [...userTransactions];
    nextUserTransactions[index] = !userTransactions[index];
    setUserTransactions(nextUserTransactions);
  }

  const getRewards = (userID, index) => {
    console.log("getRewards", userID);
    const trans = userTransactionsData(userID);
    console.log(JSON.stringify(trans));
    fetch('http://localhost:8080/rewards/calculateRewards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trans),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setUserRewardsDD(index, data)
        showUserRewards(index);
      })
      .catch(error => console.error(error));


  }


  return (
    <div className="container flex flex-col items-center ">
      <h1>Welcome to Rewards Calculator!!! </h1>
      <div>
        <table className="">
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Show Transactions</th>
            <th>Rewards</th>
          </tr>
          {user_data.map((user, index) => (
            <React.Fragment >
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.customerName}</td>
                <td>
                  <button className="bg-green-300 p-3" onClick={() => showUserTransactions(index)}>
                    {userTransactions[index] ? "Hide Transactions" : "Show Transactions"}
                  </button>
                </td>
                <td>
                  <button className="bg-red-300 p-3" onClick={() => getRewards(user.userID, index)}>
                    Calculate Rewards
                  </button>
                </td>
              </tr>
              {userTransactions[index] && (
                <tr>
                  <td colSpan={4} className="">
                    <table className="w-full border-seperate text-center">
                      <thead>
                        <tr>
                          <th className="border"> ID</th>
                          <th className="border"> Date</th>
                          <th className="border"> Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransactionsData(user.userID).map((transaction) => (
                          <tr key={transaction.trans_ID} className="">
                            <td className="border">{transaction.trans_ID}</td>
                            <td className="border">{transaction.transactionDate}</td>
                            <td className="border">{transaction.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
              {userRewards[index] && (
                <tr>
                  <td colSpan={4} className="">
                    <table className="w-full border-seperate text-center">
                      <thead>
                        <tr>
                          <th className="border"> Month</th>
                          <th className="border"> Rewards Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(userRewardsD[index].monthWise).map(([key, value]) => (
                          <tr className="key">
                            <td className="border">{key}</td>
                            <td className="border">{value}</td>
                          </tr>

                        ))}

                      </tbody>
                    </table>
                    <p>Total Rewards: {userRewardsD[index].total}</p>
                  </td>
                </tr>
              )}
              {/* </div> */}
            </React.Fragment>
          ))}

        </table>
      </div>
    </div>
  )
}

export default App;
