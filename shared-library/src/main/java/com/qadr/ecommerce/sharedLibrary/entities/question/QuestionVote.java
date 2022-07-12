package com.qadr.ecommerce.sharedLibrary.entities.question;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "question_votes")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class QuestionVote extends IdBasedEntity {
    public static final int VOTE_UP = 1;
    public static final int VOTE_DOWN = -1;
    private int votes;
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public void voteUP(){
        votes = VOTE_UP;
    }

    public void voteDown(){
        votes = VOTE_DOWN;
    }

    @Transient
    public boolean isUpvoted(){
        return votes == VOTE_UP;
    }

    @Transient
    public boolean isDownvoted(){
        return votes == VOTE_DOWN;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        QuestionVote that = (QuestionVote) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
