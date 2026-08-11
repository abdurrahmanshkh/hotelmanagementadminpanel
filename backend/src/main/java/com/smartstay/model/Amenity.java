package com.smartstay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "amenities")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "icon_name")
    private String iconName;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public Amenity() {
    }

    public Amenity(Long id, String name, String iconName, Boolean active) {
        this.id = id;
        this.name = name;
        this.iconName = iconName;
        this.active = active != null ? active : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public static AmenityBuilder builder() {
        return new AmenityBuilder();
    }

    public static class AmenityBuilder {
        private Long id;
        private String name;
        private String iconName;
        private Boolean active = true;

        public AmenityBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AmenityBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AmenityBuilder iconName(String iconName) {
            this.iconName = iconName;
            return this;
        }

        public AmenityBuilder active(Boolean active) {
            this.active = active;
            return this;
        }

        public Amenity build() {
            return new Amenity(id, name, iconName, active);
        }
    }
}
