namespace VarejoHub.Application.DTOs;

public struct Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }

    private Result(bool isSuccess, T value, string error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Ok(T value) => new Result<T>(true, value, string.Empty);
    public static Result<T> FailT(string message) => new Result<T>(false, default!, message);

    public static Result Ok() => Result.Ok();
    public static Result Fail(string message) => Result.Fail(message);
}


public struct Result
{
    public bool IsSuccess { get; }
    public string Error { get; }

    private Result(bool isSuccess, string error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Ok() => new Result(true, string.Empty);
    public static Result Fail(string message) => new Result(false, message);
}