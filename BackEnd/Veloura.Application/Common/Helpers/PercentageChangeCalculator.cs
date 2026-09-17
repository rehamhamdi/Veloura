namespace Veloura.Application.Common.Helpers;

public static class PercentageChangeCalculator
{
  
    public static decimal? Calculate(decimal current, decimal previous)
    {
        if (previous == 0)
            return null;

        return Math.Round((current - previous) / previous * 100m, 1);
    }
}
