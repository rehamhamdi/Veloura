using System.Text.Json;
using System.Text.Json.Serialization;
using Veloura.Domain.Enums;

namespace Veloura.Application.Common.Converters;

public class DiscountTypeJsonConverter : JsonConverter<DiscountType>
{
    public override DiscountType Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        var value = reader.GetString();

        return value?.ToLowerInvariant() switch
        {
            "percentage" => DiscountType.Percentage,
            "fixed" => DiscountType.FixedAmount,
            "free_shipping" => DiscountType.FreeShipping,

            _ => throw new JsonException(
                $"Unknown discount type: {value}")
        };
    }

    public override void Write(
        Utf8JsonWriter writer,
        DiscountType value,
        JsonSerializerOptions options)
    {
        var result = value switch
        {
            DiscountType.Percentage => "percentage",
            DiscountType.FixedAmount => "fixed",
            DiscountType.FreeShipping => "free_shipping",

            _ => throw new JsonException(
                $"Unknown discount type: {value}")
        };

        writer.WriteStringValue(result);
    }
}