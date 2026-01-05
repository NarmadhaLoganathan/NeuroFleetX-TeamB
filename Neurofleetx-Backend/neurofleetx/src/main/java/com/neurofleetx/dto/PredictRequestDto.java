package com.neurofleetx.dto;

public class PredictRequestDto {
    private double current;
    private double lag1;
    private double lag2;
    private double lag3;
    private long junction;

    public PredictRequestDto() {}

    public PredictRequestDto(double current, double lag1, double lag2, double lag3, long junction) {
        this.current = current;
        this.lag1 = lag1;
        this.lag2 = lag2;
        this.lag3 = lag3;
        this.junction = junction;
    }

    // getters & setters

    public double getCurrent() { return current; }
    public void setCurrent(double current) { this.current = current; }

    public double getLag1() { return lag1; }
    public void setLag1(double lag1) { this.lag1 = lag1; }

    public double getLag2() { return lag2; }
    public void setLag2(double lag2) { this.lag2 = lag2; }

    public double getLag3() { return lag3; }
    public void setLag3(double lag3) { this.lag3 = lag3; }

    public long getJunction() { return junction; }
    public void setJunction(long junction) { this.junction = junction; }
}
