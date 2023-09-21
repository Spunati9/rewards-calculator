package com.example.rewardsbackend;

import java.beans.JavaBean;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;



@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/rewards")
public class RewardsController {
    //hello world endpoint with a json response
    private final RewardsService rewardsService;

    public RewardsController(RewardsService rewardsService) {
        this.rewardsService = rewardsService;
    }


    @GetMapping("/hello")
    @ResponseStatus(org.springframework.http.HttpStatus.OK)
    public String helloWorld() {
        return "Hello World!";
    }

    //calculate rewards endpoint with a json response
    @GetMapping("/calculateRewards")
    public String calculateRewards() {
        return "Rewards Calculated!";
    }

    @PostMapping("/calculateRewards")
    public ResponseEntity<RewardsResponse> calculateRewardsPost(@RequestBody String payload) {
        System.out.println(payload);
        Gson gson = new Gson();
        Type listType = new TypeToken<List<Transaction>>() {}.getType();

        List<Transaction> transactions = gson.fromJson(payload, listType);
        rewardsService.calculateRewards(transactions);
        Map<Integer, Integer> rewardsMap = rewardsService.getRewards();
        RewardsResponse response = new RewardsResponse(transactions.get(0).userID, rewardsService.getTotalPoints(), rewardsMap);

        return ResponseEntity.ok(response);
    }
}


class Transaction{
    int userID, trans_ID;
    int amount;
    Date transactionDate;

    public String toString(){
        return transactionDate + " " + amount;
    }
}

class RewardsResponse {
    public int userID;
    private int total;
    private Map<Integer, Integer> monthWise;

    public RewardsResponse(int userID, int total, Map<Integer, Integer> monthWise) {
        this.userID = userID;
        this.total = total;
        this.monthWise = monthWise;
    }


    public void setUserID(int userID) {
        this.userID = userID;
    }


    public int getTotal() {
        return total;
    }

    public Map<Integer, Integer> getMonthWise() {
        return monthWise;
    }
}