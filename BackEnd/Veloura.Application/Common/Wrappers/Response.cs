using System.Net;

namespace Veloura.Application.Common.Wrappers;

public class Response<T>
{
    public T? Data { get; set; }
    public bool Succeeded { get; set; }
    public string? Message { get; set; }
    public List<string>? Errors { get; set; }
    public HttpStatusCode StatusCode { get; set; }
}