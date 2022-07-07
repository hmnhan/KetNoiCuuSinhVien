using Newtonsoft.Json.Converters;
using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FStudent.Tools
{
    public class DateFormatConverter : JsonConverter<DateTime>
    {
        private string format = "dd/MM/yyyy";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.ParseExact(reader.GetString(), format, CultureInfo.InvariantCulture);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(format));
        }
    }
}
