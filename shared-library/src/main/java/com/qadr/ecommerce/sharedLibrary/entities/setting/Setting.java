package com.qadr.ecommerce.sharedLibrary.entities.setting;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity @Table(name = "settings")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
public class Setting {
    @Id
    @Column(name = "`key`", nullable = false, length = 128)
    private String key;

    @Column(nullable = false, length = 2056)
    private String value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 40)
    private SettingsCategory category;

    public Setting(String key){this.key = key;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Setting setting = (Setting) o;
        return key != null && Objects.equals(key, setting.key);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
