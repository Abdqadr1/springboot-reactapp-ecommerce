package com.qadr.ecommerce.sharedLibrary.entities.question;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "questions")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Question extends IdBasedEntity {
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "asker_id")
    private Customer asker;
    private String questionContent;

    @JsonIgnore
    private Date askTime;
    private String answerContent = "";
    @ManyToOne
    @JoinColumn(name = "answerer_id")
    private User answerer;

    @JsonIgnore
    private Date answerTime;
    private boolean approvalStatus;
    private int votes;

    public Question(Integer id) {
        this.id = id;
    }

    public Question(Integer id, String answer) {
       this.id = id;
       this.answerContent = answer;
    }

    @Transient private int customerVote;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Question question = (Question) o;
        return id != null && Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Transient
    public boolean getIsAnswered(){
        return  !answerContent.isBlank()
                && answerContent.trim().length() > 0
                && answerTime != null;
    }
    @Transient
    public String getFormattedAskTime(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        return simpleDateFormat.format(askTime);
    }
    @Transient
    public String getFormattedAnswerTime(){
        if(answerTime == null) return "";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        return simpleDateFormat.format(answerTime);
    }
}
