package com.example.rewardsbackend;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class RewardsService {

    Map<Integer, Integer> rewards = new HashMap<Integer, Integer>();
    int totalRewards = 0;
    public int getTotalPoints() {
        return totalRewards;
    }

    public Map<Integer, Integer> getRewards() {
        return rewards;
    }

    public int getRewardForTransaction(int amount) {
        int rewards = 0;
        
        if (amount > 100) {
            rewards += (amount - 100) * 2;
            amount = 100;
        }
        if(amount > 50 && amount <= 100) {
            rewards += (amount - 50);
        }

        return rewards;
    }
    public void calculateRewards(List<Transaction> payload) {
        // print list
        Calendar calendar = Calendar.getInstance();
        rewards.clear();
        totalRewards = 0;
        for (Transaction transaction : payload) {
            System.out.println(transaction.amount + " " + transaction.userID + " " + transaction.transactionDate + " " + transaction.trans_ID + " " + transaction.amount);
            calendar.setTime(transaction.transactionDate);
            int month = calendar.get(Calendar.MONTH) + 1;
            int reward = getRewardForTransaction(transaction.amount);
            totalRewards += reward;
            if (rewards.containsKey(month)) {
                rewards.put(month, rewards.get(month) + reward);
            } else {
                rewards.put(month, reward);
            }
        }

        for(Map.Entry<Integer, Integer> entry : rewards.entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }

    }

    
    
}
