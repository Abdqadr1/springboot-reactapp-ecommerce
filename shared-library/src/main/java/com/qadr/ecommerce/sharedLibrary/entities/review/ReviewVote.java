package com.qadr.ecommerce.sharedLibrary.entities.review;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity @Table(name = "review_votes")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class ReviewVote extends IdBasedEntity {
    public static final int VOTE_UP = 1;
    public static final int VOTE_DOWN = -1;

    private int votes;
    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;
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
        ReviewVote that = (ReviewVote) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
